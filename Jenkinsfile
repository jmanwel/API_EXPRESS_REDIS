pipeline{
    agent any
    stages {
        stage("build"){
            steps {
                echo "Building..."
                nodejs('NodeJS 20.19.5') {
                    sh 'npm install'
                    sh 'npm build'
                }
            }
        }

        stage("test"){
            steps {
                echo "Testing..."
                nodejs('NodeJS 20.19.5') {
                    sh 'npm run test'
                }
            }
        }

        stage("deploy"){
            steps {
                echo "Deploying..."
            }
        }
    }
}