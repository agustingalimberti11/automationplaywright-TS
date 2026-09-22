pipeline {
    agent any

    environment {
        CI = 'true'
    }

    tools {
        nodejs 'node22'
    }

    stages {
        stage('Instalar dependencias') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'npm ci'
                    } else {
                        bat 'npm ci'
                    }
                }
            }
        }

        stage('Instalar browsers') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'npx playwright install --with-deps chromium'
                    } else {
                        bat 'npx playwright install chromium'
                    }
                }
            }
        }

        stage('Typecheck y lint') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'npm run typecheck'
                        sh 'npm run lint'
                    } else {
                        bat 'npm run typecheck'
                        bat 'npm run lint'
                    }
                }
            }
        }

        stage('Tests') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'npm test'
                    } else {
                        bat 'npm test'
                    }
                }
            }
        }
    }

    post {
        always {
            allure includeProperties: false,
                   jdk: '',
                   results: [[path: 'allure-results']]

            archiveArtifacts artifacts: 'playwright-report/**,test-results/**',
                             allowEmptyArchive: true
        }
    }
}
