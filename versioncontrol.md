---
marp: true
theme: default
paginate: true
---

# ACTAM: Introduction to Version Control Systems

## 20/09/2024

---

## Class outline

- Short introduction (~20 min)
- Short demo Github (~10 min)
- Setup and play with first GitHub repo (~30 min)

- Coffee/tea (~10 min)

- Short demo using Git (~10 min)
- Hands-on: Solo repo (~20 min)
- Hands-on: Collab repo (∞)

---

## Mindset

- All backgrounds are welcomed (me included)
- Collaborative approach
- Having fun == Learning
- Questions are undervalued  

---

## Magic goals

- To do many things at once (non-linear development)
- To go back in history
- To undo mistakes
- To keep control 

---

## Version/Source control of what?

- Folders, documents, codebases...a song?
- Markdown!

---

# This
## is
### a syntax
_for code snippets:_
```
print("I love markdown");
``` 
_Explore **more** at_ [Markdown Live Preview](https://markdownlivepreview.com/).

---

![](assets/linus.png)

---

## Types of version control

### Local
- Based on a simple database that kept track of all the changes in the files
- No collaboration: **Bad**

---

![](assets/local.png)

---

## Types of version control

### Centralized
- A single server that contains all the versioned files
- Entire history of the project in a single place: **bad**

---

![](assets/centralized.png)

---

## Types of version control

### Distributed (e.g Git)
- Versioned fileses are stored at different places
- Any of the client repos can be copied back up to the server to restore it: **good**

---

![](assets/distributed.png)

---

![](assets/simplified-git-flow.webp)

---

## Adding vs Committing

- *git add*: stages changes (new, modified, or deleted files) in the **staging area** preparing them for a commit
- *git commit*: records the staged changes into the repo's history, creating **a snapshot of the current state** of the project.


---

## Fetching vs Pulling

- *git fetch*: retrieves updates from a remote repo **without altering the local working directory**
- *git pull*:  retrieves updates from a remote repo and then **tries to merge to current branch**

---

## Resources

What is a pull request: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests

For VSC lovers: https://code.visualstudio.com/docs/sourcecontrol/overview