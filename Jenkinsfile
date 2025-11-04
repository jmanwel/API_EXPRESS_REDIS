pipeline{
    agent any
    stages {
        stage("build"){
            steps {
                echo "Building..."
                nodejs('NodeJS 25.1.0') {
                    sh 'npm install'
                    sh 'npm build'
                }
            }
        }

        stage("test"){
            steps {
                echo "Testing..."
                nodejs('NodeJS 25.1.0') {
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