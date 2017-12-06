pipeline {
  agent any
  environment {
    BUILD_ID='dontKillMe'
    BACKEND_URL='46.101.132.193:4567'
  }
  stages {
    stage('Purge Docker') {
      steps {
        sh 'docker rm --force $(docker ps -a -q)'
        sh 'docker rmi --force $(docker images -q)'
      }
    }
    stage('Build Docker') {
      steps {
        sh 'docker-compose up -d --build'
      }
    }
    stage('Init Database') {
      steps {
        sh 'docker exec swerea bash -c "make db-init"'
      }
    }
    stage('Install') {
      parallel {
        stage('Front-end') {
          steps {
            sh 'docker exec swerea bash -c "make install-frontend"'
          }
        }
        stage('Back-end') {
          steps {
            sh 'docker exec swerea bash -c "make install-backend"'
          }
        }
      }
    }
    stage('Run') {
      parallel {
        stage('run front-end') {
          steps {
            sh 'docker exec swerea bash -c "make frontend"'
          }
        }
        stage('run back-end') {
          steps {
            sh 'docker exec swerea bash -c "make backend"'
          }
        }
      }
    }
  }
}
