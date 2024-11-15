# Git Deploy

This is a basic script for automating deployment. You should move this folder outside the main repository to prevent overwrites.

## Configuration
Edit `deploySettings.json` to set pre-pull, post-pull, and deployment actions.

### Target
The `target` field specifies the path to the root of your local repository where deployment actions will be executed. 

### Actions

#### pre-pull

The `pre-pull` section allows you to define actions that should occur **before** pulling the latest code from the repository. These can include:

-   **YAML overrides**: Modify specific values in YAML configuration files.
-   **Pattern replacements**: Search and replace specific patterns in files (e.g., configuration files).
-   **Commands**: Custom shell commands to run before pulling the code (e.g., backup actions, configuration setup).

#### post-pull

The `post-pull` section defines actions that should occur **after** pulling the latest code. Similar to `pre-pull`, these actions may involve:

-   **YAML overrides**: Apply further changes to configuration files after the pull.
-   **Pattern replacements**: Modify files post-pull.
-   **Commands**: Additional tasks such as rebuilding assets, restarting services, or reconfiguring settings.

#### deploy

The `deploy` section specifies the final deployment actions. These actions are executed after the code is updated and all configurations are applied. You can define:

-   **Working directory**: Directories where commands should be executed.
-   **Commands**: Commands related to building, testing, or deploying the application, such as `npm install`, `npm run build`, or custom deployment scripts.

#### Sample config:
```
{
    "target": "../",
    "pre_pull": {
        "commands": [
            "git stash"
        ]
    },
    "post_pull": {
        "yaml": [
            {
                "path": "server/docker-compose.yml",
                "overrides": [
                    {
                        "docpath": "services:themepark-server:environment:CLIENT_ORIGIN",
                        "value": "ADD_SERVER_URL_HERE"
                    }
                ]
            }
        ],
        "patterns": [
            {
                "path": "themepark_website/src/App.js",
                "overrides": [
                    {
                        "pattern": "const apiUrl = ",
                        "replacement": "const apiUrl = 'ADD_SERVER_API_URL_HERE';\n"
                    }
                ]
            }
        ]
    },
    "deploy": [
        {
            "working_dir": "server",
            "commands": [
                "mkdir -p server_root",
                "cp *.js server-cert.pem server-key.pem server_root",
                "docker compose up -d --force-recreate"
            ]
        },
        {
            "working_dir": "themepark_website",
            "commands": [
                "mkdir -p build",
                "npm install",
                "npm run build",
                "docker compose up -d --force-recreate"
            ]
        }
    ]
}
```
## Running
Running `deploy.py` will execute the actual deployment actions. It also pulls from the target repository, applying any necessary configuration changes and then executing deployment steps. By default, the script only runs when changes are detected on the main repository, meaning it checks for updates by comparing the latest commit hash on the remote repository with the local commit hash.

### Example:
```
python deploy.py
```
This command will:

1.  Check for new commits in the remote repository.
2.  Run pre-pull actions (YAML overrides, pattern replacements, etc.).
3.  Pull the latest changes from the repository.
4.  Run post-pull actions (e.g., apply further overrides, run tests, etc.).
5.  Execute deployment actions (e.g., install dependencies, build assets, etc.).

For testing purposes, the `-skip-check` argument allows the deployment script to run all actions (pre-pull, pull, post-pull, and deploy) even if no new commits are detected on the remote repository.

## Scheduling via Cron (Optional)

If you wish to automate the deployment process, you can schedule this script to run at a specific interval using `cron` (for Unix-like systems). For example, to run the deployment every hour:
```
0 * * * * /path/to/python /path/to/deploy.py >> /path/to/logfile.log 2>&1
```
This will run the script every hour, logging the output to `logfile.log`.
