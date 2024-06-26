/////////////////////////////////////////////////////////////////////
provider "aws" {
  region  = "eu-west-1"
  profile = "TimoBBD"
}

/////////////////////////////////////////////////////////////////////
#Our main vpc in eu-west1
resource "aws_vpc" "mainVPC" {
  cidr_block            = "10.0.0.0/16"
  enable_dns_hostnames  = true

  tags = {
    Name = "main"
    owner = "timo.vdmerwe@bbd.co.za"
    created-using = "terraform"
  }
}

/////////////////////////////////////////////////////////////////////
#Internet Gateway for vpc. Required to route traffic from our subnets to the internet
resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.mainVPC.id

  tags = {
    Name = "mainGW"
    owner = "timo.vdmerwe@bbd.co.za"
    created-using = "terraform"
  }
}

/////////////////////////////////////////////////////////////////////
#Add route to default route table. Without this traffic can't be routed back out, but it can come in
resource "aws_route" "add_to_default_route" {
  route_table_id         = aws_vpc.mainVPC.default_route_table_id
  destination_cidr_block = "0.0.0.0/0" #where we want the traffic to go
  gateway_id             = aws_internet_gateway.gw.id #where we need to send it: our gateway
}

/////////////////////////////////////////////////////////////////////
#One subnet for the main db and a second subnet for the standby db
#We need at least two subnet groups in different availability zones for rds

#Our first subnet in the vpc for az eu-west-1a
resource "aws_subnet" "subnet1" {
  vpc_id     = aws_vpc.mainVPC.id
  cidr_block = "10.0.1.0/24"
  availability_zone = "eu-west-1a"

  tags = {
    Name = "subnet1"
    owner = "timo.vdmerwe@bbd.co.za"
    created-using = "terraform"
  }
}

#Our second subnet in the vpc for az eu-west-1b
resource "aws_subnet" "subnet2" {
  vpc_id     = aws_vpc.mainVPC.id
  cidr_block = "10.0.2.0/24"
  availability_zone = "eu-west-1b"

  tags = {
    Name = "subnet2"
    owner = "timo.vdmerwe@bbd.co.za"
    created-using = "terraform"
  }
}

/////////////////////////////////////////////////////////////////////
#Group our subnets together for the database
resource "aws_db_subnet_group" "database_subnet_group" {
  name         = "database subnet group"
  subnet_ids   = [aws_subnet.subnet1.id, aws_subnet.subnet2.id]
  description  = "The subnet group for our database"

  tags = {
    Name = "database_subnet_group"
    owner = "timo.vdmerwe@bbd.co.za"
    created-using = "terraform"
  }
}

/////////////////////////////////////////////////////////////////////
#Security group for our database
resource "aws_security_group" "database_security_group" {
  name        = "database security group"
  description = "enable access on port 3306"
  vpc_id      = aws_vpc.mainVPC.id

  ingress {
    description      = "mysql access"
    from_port        = 3306
    to_port          = 3306
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
  }

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = -1
    cidr_blocks      = ["0.0.0.0/0"]
  }

  tags = {
    Name = "database_security_group"
    owner = "timo.vdmerwe@bbd.co.za"
    created-using = "terraform"
  }
}

/////////////////////////////////////////////////////////////////////
#Create the rds instance
resource "aws_db_instance" "db_instance" {
  engine                  = "mysql"
  engine_version          = "8.0.35"
  multi_az                = true
  identifier              = "meetingsmanagerdbinstance" #the name of the instance
  username                = "Admin"
  password                = ""
  instance_class          = "db.t3.micro"
  allocated_storage       = 5
  db_subnet_group_name    = aws_db_subnet_group.database_subnet_group.name
  vpc_security_group_ids  = [aws_security_group.database_security_group.id]
  db_name                 = "meetingmanager"
  skip_final_snapshot     = true
  publicly_accessible     = true

  tags = {
    Name = "meetingsmanagerdbinstance"
    owner = "timo.vdmerwe@bbd.co.za"
    created-using = "terraform"
  }
}

/////////////////////////////////////////////////////////////////////
#Security group for our ec2 isntance
resource "aws_security_group" "ec2_security_group" {
  name        = "ec2 security group"
  description = "enable ssh access on port 22"
  vpc_id      = aws_vpc.mainVPC.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "ec2_security_group"
    owner = "timo.vdmerwe@bbd.co.za"
    created-using = "terraform"
  }
}

/////////////////////////////////////////////////////////////////////
#Create the ec2 instance
resource "aws_instance" "ec2_instance" {
  ami           = "ami-0776c814353b4814d"
  instance_type = "t3.micro"
  subnet_id     = aws_subnet.subnet1.id
  security_groups = [aws_security_group.ec2_security_group.id]
  key_name      = "MeetingsManagerKey"
  associate_public_ip_address = true

  tags = {
    Name = "ec2_instance"
    owner = "timo.vdmerwe@bbd.co.za"
    created-using = "terraform"
  }
}
