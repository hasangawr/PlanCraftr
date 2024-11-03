resource "aws_instance" "plancraftr_dev_server" {
  ami           = "ami-047126e50991d067b"
  instance_type = "t2.micro"
}