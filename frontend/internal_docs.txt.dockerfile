europe-west1-docker.pkg.dev/xzist-software/xzist-backend
25ec4930eeae46e1ba50368cae407d23a5d9b8468efa134fb24915af94130b90
europe-west1-docker.pkg.dev/xzist-software/xzist-frontend


"mongodb": "mongodb://127.0.0.1:27017/backend",


docker tag nextjs-docker:latest europe-west1-docker.pkg.dev/xzist-software/xzist-frontend/my-nextjs-image:tag1
docker push europe-west1-docker.pkg.dev/xzist-software/xzist-frontend/my-nextjs-image:tag1

docker tag my-feathers-image:latest europe-west1-docker.pkg.dev/xzist-software/xzist-backend/my-feathers-image:tag1
docker push europe-west1-docker.pkg.dev/xzist-software/xzist-backend/my-feathers-image:tag1