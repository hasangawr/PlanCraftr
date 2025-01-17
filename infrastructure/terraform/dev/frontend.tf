
resource "aws_s3_bucket" "www_dev_plancraftr_com" {
    bucket = "www.dev.plancraftr.com"
    force_destroy = true
}

resource "aws_s3_bucket" "dev_plancraftr_com" {
    bucket = "dev.plancraftr.com"
}

resource "aws_s3_bucket_public_access_block" "allow_public_access_s3_www_dev" {
  bucket = aws_s3_bucket.www_dev_plancraftr_com.id

  block_public_acls = false
  block_public_policy = false
  ignore_public_acls = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "allow_anyone_get_objects_s3_www_dev" {
  bucket = aws_s3_bucket.www_dev_plancraftr_com.id

  policy = jsonencode({
    "Version": "2012-10-17",
    "Id": "PlancraftrS3AccessPolicy",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": "*",
            "Action": [
              "s3:GetObject"
            ],
            "Resource": "arn:aws:s3:::www.dev.plancraftr.com/*"
        }
    ]
  })

  depends_on = [ aws_s3_bucket_public_access_block.allow_public_access_s3_www_dev ]
}

# resource "aws_s3_bucket_public_access_block" "allow_public_access_s3_dev" {
#   bucket = aws_s3_bucket.dev_plancraftr_com.id

#   block_public_acls = false
#   block_public_policy = false
#   ignore_public_acls = false
#   restrict_public_buckets = false
# }

# resource "aws_s3_bucket_policy" "allow_anyone_get_objects_s3_dev" {
#   bucket = aws_s3_bucket.dev_plancraftr_com.id

#   policy = jsonencode({
#     "Version": "2012-10-17",
#     "Id": "PlancraftrS3AccessPolicy",
#     "Statement": [
#         {
#             "Effect": "Allow",
#             "Principal": "*",
#             "Action": [
#               "s3:GetObject"
#             ],
#             "Resource": "arn:aws:s3:::dev.plancraftr.com/*"
#         }
#     ]
#   })

#   depends_on = [ aws_s3_bucket_public_access_block.allow_public_access_s3_dev ]
# }

resource "aws_s3_bucket_website_configuration" "static_website_config_s3_www_dev" {
  bucket = aws_s3_bucket.www_dev_plancraftr_com.id

  index_document {
    suffix = "index.html"
  }
}

resource "aws_s3_bucket_website_configuration" "static_website_config_s3_dev" {
  bucket = aws_s3_bucket.dev_plancraftr_com.id

  redirect_all_requests_to {
    host_name = "www.dev.plancraftr.com"
    protocol = "https"
  }
}

## Cloudfront config
resource "aws_cloudfront_function" "dev_routing_handler" {
  name = "dev_routing_handler"
  runtime = "cloudfront-js-2.0"
  comment = "handle routing"
  publish = true
  code = file("${path.module}/function.js")
}

resource "aws_cloudfront_distribution" "www_dev_distribution" {
    origin {
      domain_name = aws_s3_bucket.www_dev_plancraftr_com.bucket_regional_domain_name
      origin_id = "www_dev_s3_origin"
    }

    default_cache_behavior {
      viewer_protocol_policy = "redirect-to-https"
      allowed_methods = [ "GET", "HEAD" ]
      target_origin_id = "www_dev_s3_origin"
      cached_methods = [ "GET", "HEAD" ]

      forwarded_values {
        query_string = false

        cookies {
          forward = "none"
        }
      }

      function_association {
        event_type = "viewer-request"
        function_arn = aws_cloudfront_function.dev_routing_handler.arn
      }
    }

    viewer_certificate {
      acm_certificate_arn = "arn:aws:acm:us-east-1:084828604403:certificate/f5772987-cecc-431c-b5fd-1e2bd7e0c727"
      ssl_support_method = "sni-only"
    }

    restrictions {
      geo_restriction {
        restriction_type = "none"
      }
    }

    aliases = ["www.dev.plancraftr.com"]
    enabled = true
    default_root_object = "index.html"
    ##retain_on_delete = true
}

resource "aws_cloudfront_distribution" "dev_distribution" {
    origin {
      domain_name = aws_s3_bucket.dev_plancraftr_com.website_endpoint
      origin_id = "dev_s3_origin"
      custom_origin_config {
        origin_protocol_policy = "http-only"
        http_port = 80
        https_port = 443
        origin_ssl_protocols = [ "TLSv1.2" ]
      }
    }

    default_cache_behavior {
      viewer_protocol_policy = "redirect-to-https"
      allowed_methods = [ "GET", "HEAD" ]
      target_origin_id = "dev_s3_origin"
      cached_methods = [ "GET", "HEAD" ]

      forwarded_values {
        query_string = false

        cookies {
          forward = "none"
        }
      }
    }

    viewer_certificate {
      acm_certificate_arn = "arn:aws:acm:us-east-1:084828604403:certificate/f5772987-cecc-431c-b5fd-1e2bd7e0c727"
      ssl_support_method = "sni-only"
    }

    restrictions {
      geo_restriction {
        restriction_type = "none"
      }
    }

    aliases = ["dev.plancraftr.com"]
    enabled = true
    #default_root_object = "index.html"
    ##retain_on_delete = true

    ##depends_on = [ aws_s3_bucket_policy.allow_anyone_get_objects_s3_www_dev ]

}


## Route 53 config
resource "aws_route53_record" "www_dev_plancraftr" {
  zone_id = "Z097947118UN4SFV6P8TX"
  name    = "www.dev.plancraftr.com"
  type    = "A"

  alias {
    name = aws_cloudfront_distribution.www_dev_distribution.domain_name
    zone_id = aws_cloudfront_distribution.www_dev_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "dev_plancraftr" {
  zone_id = "Z097947118UN4SFV6P8TX"
  name    = "dev.plancraftr.com"
  type    = "A"

  alias {
    name = aws_cloudfront_distribution.dev_distribution.domain_name
    zone_id = aws_cloudfront_distribution.dev_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}