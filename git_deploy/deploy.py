import json
import yaml
import os

with open('deploySettings.json') as f:
    settings = json.load(f)

def apply_override(ydoc, override):
    docpath = override.get("docpath")
    value = override.get("value")
    if not (docpath and value):
        return
    print(f"    {docpath}={value}")
    docpath = docpath.split(":")
    item = ydoc
    for dp in docpath[:-1]:
        item = item[dp]
    matches = [i for i, v in enumerate(item) if v.startswith(docpath[-1])]
    item[matches[0]] = f"{docpath[-1]}={value}"

def apply_pattern(lines, pattern):
    replacement = pattern.get("replacement")
    pattern = pattern.get("pattern")
    if not (pattern and replacement):
        return
    for i, line in enumerate(lines):
        idx = line.find(pattern)
        if idx < 0:
            continue
        lines[i] = line[:idx] + replacement
        print(f"    Line {i+1} - {line.strip()} > {lines[i].strip()}")

def parse_yaml_list(ylist, base_path):
    if not ylist:
        return
    print("YAML overrides:")
    for ymod in ylist:
        path = ymod.get("path")
        overrides = ymod.get("overrides")
        if not (path and overrides):
            continue
        print(f'  {path}:')
        path = os.path.join(base_path, path)
        with open(path, 'r') as f:
            ydoc = yaml.safe_load(f)
        for override in overrides:
            apply_override(ydoc, override)
        with open(path, 'w') as f:
            yaml.dump(ydoc, f)

def parse_pattern_list(plist, base_path):
    if not plist:
        return
    print("File overrides:")
    for pmod in plist:
        path = pmod.get("path")
        overrides = pmod.get("overrides")
        if not (path and overrides):
            continue
        print(f'  {path}:')
        path = os.path.join(base_path, path)
        with open(path, 'r') as f:
            lines = f.readlines()
        for pattern in overrides:
            apply_pattern(lines, pattern)
        with open(path, 'w') as f:
            f.writelines(lines)

def run_commands(command_list):
    for command in command_list:
        print(f'Executing "{command}"')
        ret = os.system(command)
        ret >>= 8
        if ret != 0:
            print(f'"{command}" returned non-zero exit status. Aborting...')
            exit()

def run_command_in_dir(command, dir):
    cwd = os.getcwd()
    os.chdir(dir)
    ret = os.system(command)
    os.chdir(cwd)
    ret >>= 8
    if ret != 0:
        print(f'"{command}" returned non-zero exit status. Aborting...')
        exit()

def run_commands_in_dir(command_list, dir):
    for command in command_list:
        print(f'Executing "{command}"')
        run_command_in_dir(command, dir)

def process_stage(stage, target_path):
    if not stage:
        return
    ylist = stage.get("yaml")
    patterns = stage.get("patterns")
    parse_yaml_list(ylist, target_path)
    parse_pattern_list(patterns, target_path)
    run_commands(stage.get("commands", []))

def process_deploy(deploy_cfg, target_path):
    for actions in deploy_cfg:
        working_dir = actions.get("working_dir")
        commands = actions.get("commands")
        if not (working_dir and commands):
            return
        working_dir = os.path.abspath(os.path.join(target_path, working_dir))
        run_commands_in_dir(commands, working_dir)
        print(os.getcwd())

def main():
    target_path = os.path.abspath(settings['target'])
    if not os.path.isdir(target_path):
        raise RuntimeError(f"Target does not exist: {target_path}")
    pre_pull = settings.get("pre_pull")
    post_pull = settings.get("post_pull")
    deploy = settings.get("deploy")
    print("Running pre-pull actions...")
    process_stage(pre_pull, target_path)
    print("Pulling...")
    os.system(settings.get("pull_cmd", "git pull"))
    print("Running post-pull actions...")
    process_stage(post_pull, target_path)
    print("Deploying...")
    process_deploy(deploy, target_path)

if __name__ == "__main__":
    main()