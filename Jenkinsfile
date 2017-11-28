pipeline {
  agent any
  stages {
    stage('Build Docker') {
      steps {
        sh '''docker-compose up -d --build
docker exec -it swerea bash'''
      }
    }
    stage('Init Database') {
      steps {
        sh 'make db-init '
      }
    }
    stage('Install') {
      parallel {
        stage('Front-end') {
          steps {
            sh 'make install-client'
          }
        }
        stage('Back-end') {
          steps {
            sh 'make install-backend'
          }
        }
      }
    }
    stage('Run') {
      parallel {
        stage('run front-end') {
          steps {
            sh 'make backend'
          }
        }
        stage('run back-end') {
          steps {
            sh 'make frontend'
          }
        }
      }
    }
  }
}