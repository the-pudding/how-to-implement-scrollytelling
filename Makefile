dev:
	browser-sync start --ss . --files . --index index.html --no-notify

s3:
	aws s3 sync . s3://pudding.cool/process/how-to-implement-scrollytelling --exclude '.*' --exclude '**/.*' --exclude 'Makefile' --exclude 'README.md'