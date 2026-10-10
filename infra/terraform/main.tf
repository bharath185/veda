# Terraform AWS Infrastructure for ShopFlow
terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

variable "aws_region" {
  default = "ap-south-1" # Mumbai region
}

variable "environment" {
  default = "production"
}

# 1. VPC & Subnets
resource "aws_vpc" "shopflow_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
  tags = {
    Name        = "shopflow-${var.environment}-vpc"
    Environment = var.environment
  }
}

# 2. RDS PostgreSQL (Multi-AZ with encrypted storage)
resource "aws_db_instance" "shopflow_rds" {
  identifier          = "shopflow-${var.environment}-db"
  allocated_storage   = 50
  max_allocated_storage = 500
  engine              = "postgres"
  engine_version      = "16.1"
  instance_class      = "db.t4g.xlarge"
  db_name             = "shopflow_db"
  username            = "shopflow_admin"
  password            = "ReplaceWithAWSSecretsManagerSecret123!"
  storage_encrypted   = true
  skip_final_snapshot = false
  final_snapshot_identifier = "shopflow-db-final-snapshot"
  multi_az            = true
  deletion_protection = true

  tags = {
    Name = "ShopFlow Production Database"
  }
}

# 3. S3 Bucket for Media Assets & Product Images
resource "aws_s3_bucket" "assets_bucket" {
  bucket = "shopflow-cdn-assets-${var.environment}"
}

resource "aws_s3_bucket_public_access_block" "block_public" {
  bucket = aws_s3_bucket.assets_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# 4. CloudFront CDN Distribution
resource "aws_cloudfront_distribution" "cdn" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  origin {
    domain_name = aws_s3_bucket.assets_bucket.bucket_regional_domain_name
    origin_id   = "S3-shopflow-assets"
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-shopflow-assets"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}

# 5. Application Load Balancer
resource "aws_lb" "alb" {
  name               = "shopflow-${var.environment}-alb"
  internal           = false
  load_balancer_type = "application"
  subnets            = [aws_vpc.shopflow_vpc.id]

  enable_deletion_protection = true
  drop_invalid_header_fields = true

  tags = {
    Environment = var.environment
  }
}
