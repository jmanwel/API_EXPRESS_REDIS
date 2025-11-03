pipeline{
    agent any
    stages {
        stage("build"){
            steps {
                echo "Building..."
                sh 'npm install'
                sh 'npm build'
            }
        }

        stage("test"){
            steps {
                echo "Testing..."
                nodejs('NodeJS_25') {
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