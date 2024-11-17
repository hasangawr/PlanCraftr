# resource "aws_cloudfront_distribution" "name" {
  
# }

resource "aws_s3_bucket" "www_staging_plancraftr_com" {
    bucket = "www.staging.plancraftr.com"

}

resource "aws_s3_bucket" "staging_plancraftr_com" {
    bucket = "staging.plancraftr.com"
}

resource "aws_s3_bucket_public_access_block" "allow_public_access_s3_www_staging" {
  bucket = aws_s3_bucket.www_staging_plancraftr_com.id

  block_public_acls = false
  block_public_policy = false
  ignore_public_acls = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "allow_anyone_get_objects_s3_www_staging" {
  bucket = aws_s3_bucket.www_staging_plancraftr_com.id

  policy = jsonencode({
    "Version": "2012-10-17",
    "Id": "PlancraftrS3AccessPolicy",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::www.staging.plancraftr.com/*"
        }
    ]
  })
}

resource "aws_s3_bucket_website_configuration" "static_website_config_s3_www_staging" {
  bucket = aws_s3_bucket.www_staging_plancraftr_com.id

  index_document {
    suffix = "index.html"
  }
}

resource "aws_s3_bucket_website_configuration" "static_website_config_s3_staging" {
  bucket = aws_s3_bucket.staging_plancraftr_com.id

  redirect_all_requests_to {
    host_name = "www.staging.plancraftr.com"
    protocol = "https" #change to https
  }
}


## Route 53 config
resource "aws_route53_record" "www_staging_plancraftr" {
  zone_id = "Z097947118UN4SFV6P8TX"
  name    = "www.staging.plancraftr.com"
  type    = "A"

  alias {
    name = aws_s3_bucket.www_staging_plancraftr_com.website_endpoint
    zone_id = aws_s3_bucket.www_staging_plancraftr_com.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "staging_plancraftr" {
  zone_id = "Z097947118UN4SFV6P8TX"
  name    = "staging.plancraftr.com"
  type    = "A"

  alias {
    name = aws_s3_bucket.staging_plancraftr_com.website_endpoint
    zone_id = aws_s3_bucket.staging_plancraftr_com.hosted_zone_id
    evaluate_target_health = false
  }
}