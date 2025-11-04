pipeline{
    agent any
    tools {
            nodejs 'NodeJS 20.19.5' // Use the name configured in Global Tool Configuration
        }
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
                sh 'npm run test'
            }
        }

        stage("deploy"){
            steps {
                echo "Deploying..."
            }
        }
    }
}