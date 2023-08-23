# Contributing to firecamp.dev

Thank you for showing an interest in contributing to firecamp.dev! All kinds of contributions are valuable to us. Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

In this guide, we will cover how you can quickly onboard and make your first contribution.

> Before jumping into a PR be sure to search [existing PRs](https://github.com/firecamp-dev/firecamp/pulls) or [issues](https://github.com/firecamp-dev/firecamp/issues) for an open or closed item that relates to your submission.

## Developing
The development branch is main. This is the branch where all pull requests should be made against. The changes on the main branch are tagged into a release periodically.

To develop locally:

1. [Fork](https://help.github.com/articles/fork-a-repo/) this repository to your own GitHub account and then [clone](https://help.github.com/articles/cloning-a-repository/) it to your local device.

2. Create a new branch:
   
   ```
   git checkout -b feat/MY_BRANCH_NAME
   ```
   > Use a descriptive and meaningful name for the branch that reflects the purpose of your contribution.
   
3. Set up your `.env` file:
   - Duplicate .env.example to .env. 
   ```
      cp .env.example .env
   ```

4. Install pnpm:

    ```
    npm install -g pnpm
   ``` 
   > or install [via brew, curl, or wget](https://pnpm.io/installation)
  
5. Install the dependencies with:
   ```
   pnpm i
   ```
   
6. Start developing and watch for code changes:

   ```
   pnpm dev
   ```

## Commit Guidelines

- We encourage [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) format for your commit messages.
- Keep your commit messages concise, clear, and descriptive.
- Make sure to include a brief summary of the changes made in the commit.

```
The commit message should be structured as follows:

<type>[optional scope]: <description>

[optional body]

[optional footer(s)]

```
Example Commit Message:

```
feat(auth): Add new authentication module
```

## Building
More info on how to build the app coming soon.

## Testing
More info on how to add new tests coming soon.

## Linting
More info on how to lint coming soon.

## Pull Request Workflow

1. Make your changes in the branch, following the project's coding style and guidelines.
2. Commit your changes with appropriate messages, adhering to the commit guidelines mentioned above.
3. Push your branch to your forked repository.
4. Create a pull request (PR) from your branch to the main firecamp.dev repository.
5. Provide a clear and concise title for your pull request, summarizing the changes made.
6. In the PR description, provide a brief explanation of the problem you solved or the feature you added. If applicable, include relevant screenshots or a video showcasing the changes and link the issue id.
7. Tag your PR with one or more relevant labels from the following options: `graphql`, `ui`, `documentation`, `rest`, `backend`, or any other appropriate labels.




## Issue Creation

1. Before creating a new issue, search the issue tracker to ensure it doesn't already exist.
2. Create a new issue if it hasn't been reported yet
3. Follow the relevant issue/bug template   
4. In the issue description, provide clear steps to reproduce the problem or describe the desired feature in detail. If relevant, include a screenshot or a video to aid understanding.
5. Tag the issue with appropriate labels to categorize it correctly.


## General Community Guidelines

1. Be respectful and considerate when interacting with other community members.
2. Follow the code of conduct specified by firecamp.dev. Treat others with kindness, empathy, and professionalism.
3. Provide constructive feedback and suggestions, helping to improve the project.
4. Engage in discussions and contribute positively to the community.
5. Keep communication clear and concise, using appropriate channels such as GitHub issues or designated forums.

By following these guidelines, you'll contribute effectively to firecamp.dev and help build a vibrant and collaborative open-source community. Thank you for your contributions!
