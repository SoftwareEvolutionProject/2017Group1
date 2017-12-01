pipeline {
  agent any
  stages {
    stage('Purge Docker') {
      steps {
        sh 'docker rm $(docker ps -a -q)'
        sh 'docker rmi $(docker images -q)'
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