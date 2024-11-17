# resource "aws_cloudfront_distribution" "name" {
  
# }

resource "aws_s3_bucket" "www.staging.plancraftr.com" {
    bucket = "www.staging.plancraftr.com"

}

resource "aws_s3_bucket" "staging.plancraftr.com" {
    bucket = "staging.plancraftr.com"
}

resource "aws_s3_bucket_public_access_block" "allow_public_access_s3_www_staging" {
  bucket = aws_s3_bucket.www.staging.plancraftr.com.id

  block_public_acls = false
  block_public_policy = false
  ignore_public_acls = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "allow_anyone_get_objects_s3_www_staging" {
  bucket = aws_s3_bucket.www.staging.plancraftr.com.id

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
  bucket = aws_s3_bucket.www.staging.plancraftr.com.id

  index_document {
    suffix = "index.html"
  }
}

resource "aws_s3_bucket_website_configuration" "static_website_config_s3_staging" {
  bucket = aws_s3_bucket.staging.plancraftr.com.id

  redirect_all_requests_to {
    host_name = "www.staging.plancraftr.com"
    protocol = "http" #change to https
  }
}