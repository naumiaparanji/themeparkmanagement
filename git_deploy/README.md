# Git Deploy

These are some basic scripts for automating deployment. You should move this folder outside of the main repository folder to prevent overwrites.

## Configuration
Edit `deploySettings.json` to set pre-pull, post-pull, and deployment actions.

## Running
Running `deploy.py` will execute the actual deployment actions. It also pulls from the target repository.

I'm still working on some other things that should hopefully link to GitHub webhooks and run this on new commits.