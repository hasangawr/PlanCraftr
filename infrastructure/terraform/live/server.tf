resource "aws_security_group" "live_server_plancraftr_sg" {
  name        = "live_server_plancraftr_sg"
  description = "Allow HTTP and HTTPS traffic from the internet"

  ingress {
    description = "Allow HTTP traffic"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Allow HTTPS traffic"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Allow SSH access"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Or specify a narrower range for security
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "live_server_plancraftr" {
  ami           = "ami-047126e50991d067b"
  instance_type = "t2.micro"

  tags = {
    Name = "live_server_plancraftr"
  }

  key_name = "plancraftr-server-ssh-keypair"
  vpc_security_group_ids = [aws_security_group.live_server_plancraftr_sg.id]
}

# Fetch the Hosted Zone
# data "aws_route53_zone" "plancraftr_zone" {
#   name = "plancraftr.com"
# }

# Route 53 Record pointing to EC2 instance
resource "aws_route53_record" "live_api_plancraftr" {
  zone_id = "Z097947118UN4SFV6P8TX"
  name    = "live.api.plancraftr.com"
  type    = "A"
  ttl     = 300
  records = [aws_instance.live_server_plancraftr.public_ip]
}

output "live_public_ip" {
  value = aws_instance.live_server_plancraftr.public_ip
}