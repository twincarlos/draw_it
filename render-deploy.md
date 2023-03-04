# Deploying your Express + React Project to Render
Render is a web application for deploying fullstack applications. The free tier allows you to create a database instance to store database schemas and tables for multiple applications, as well as host web services (such as APIs) and static sites.

Before you begin deploying, **make sure to remove any `console.log`s or `debugger`s in any production code.** You can search your entire project folder to see if you are using them anywhere by clicking on the magnifying glass icon on the top left sidebar of VSCode.

In the following phases, you will configure the Postgres database for production and configure scripts for building the React app and starting the Express production server.

# Best Deployment practices
You can set Render to auto-deploy your project every time you complete a feature! Essentially, anytime you merge a feature branch into the development branch.

Merge your development branch into your main branch, then follow the deployment instructions below.

# Phase 1: Setting up your Express + React application
Right now, your React application may be on a different localhost port than your Express application. However, since your React application only consists of static files that don't need to bundled continuously with changes in production, your Express application can serve the React assets in production too. These static files live in the `frontend/build folder` after running `npm run build` in the `frontend` folder.

Add the following changes into your `backend/routes.index.js` file.

_Note: If your project had already been deployed on Heroku, you may have already made these changes. In this case, just double check your code to make sure it matches the code below._

At the root route, serve the React application's static `index.html` file along with `XSRF-TOKEN` cookie. Then serve up all the React application's static files using the `express.static` middleware. Serve the `index.html` and set the `XSRF-TOKEN` cookie again on all routes that don't start in `/api`. You should already have this set up in `backend/routes/index.js` which should now look like this:

```
// backend/routes/index.js
const express = require('express');
const router = express.Router();
const apiRouter = require('./api');
router.use('/api', apiRouter);
// Static routes
// Serve React build files in production
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  // Serve the frontend's index.html file at the root route
  router.get('/', (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    res.sendFile(
      path.resolve(__dirname, '../../frontend', 'build', 'index.html')
    );
  });
  // Serve the static assets in the frontend's build folder
  router.use(express.static(path.resolve("../frontend/build")));
  // Serve the frontend's index.html file at all other routes NOT starting with /api
  router.get(/^(?!\/?api).*/, (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    res.sendFile(
      path.resolve(__dirname, '../../frontend', 'build', 'index.html')
    );
  });
}
// Add a XSRF-TOKEN cookie in development
if (process.env.NODE_ENV !== 'production') {
  router.get('/api/csrf/restore', (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    res.status(201).json({});
  });
}
module.exports = router;
```

Initialize a `package.json` file at the very root of your project directory (outside of both the `backend` and `frontend` folders) with `npm init -y`, if one does not already exist.

To deploy your Express site with a React frontend, you will need to modify some scripts in the root `package.json` file. Overwrite the `install` script in the root `package.json` to install the packages in the `backend` and `frontend` folders:

```
npm --prefix backend install backend && npm --prefix frontend install frontend
```

This will run `npm install` in the `backend` folder then run `npm install` in the `frontend` folder.

Next, define a `render-postbuild` script that will run the `npm run build` command in the `frontend` folder. This will build the React static files in the `frontend` folder. The `render-postbuild` script should run the `build` script in the `frontend` folder. This step is new for all projects.

```
npm run build --prefix frontend
```

The root `package.json`'s scripts should look like this:

```
  "scripts": {
    "render-postbuild": "npm run build --prefix frontend",
    "install": "npm --prefix backend install backend && npm --prefix frontend install frontend",
    "dev:backend": "npm install --prefix backend start",
    "dev:frontend": "npm install --prefix frontend start",
    "sequelize": "npm run --prefix backend sequelize",
    "sequelize-cli": "npm run --prefix backend sequelize-cli",
    "start": "npm start --prefix backend",
    "build": "npm run build --prefix backend"
  },
```

The `dev:backend` and `dev:frontend` scripts are optional and will not be used for Render.

Commit your changes.

_Note: Take a minute to compare the scripts above for the root package.json with the scripts in your project, especially if you previously deployed the project to Heroku. Confirming they are correct now will save time in the long run._

# Phase 2: Set up Render.com account
_Skip this step if you already have a Render.com account connected to your GitHub account._

Navigate to the [Render homepage](https://render.com/) and click on "Get Started". On the Sign Up page, click on the GitHub button. This will allow you to sign in to Render through your GitHub account, and easily connect your repositories to Render for deployment. Follow the instructions to complete your registration and verify your account information.

# Phase 3: Create a Postgres Database Instance
_Skip this step if you have already created your Render Postgres database instance for another application._

Sign in to Render using your GitHub credentials, and navigate to your [Dashboard](https://dashboard.render.com/).

Click on the "New +" button in the navigation bar, and click on "PostgreSQL" to create your Postgres database instance.

In the name field, give your database a descriptive name. Note that all of your applications will share this database instance, so make it general (for example, you might name it "App-Academy-Projects"). For the region field, choose the location nearest to you. The rest of the fields in this section can be left blank.

Click the "Create Database" button to create the new Postgres database instance. Within a few minutes, your new database will be ready to use. Scroll down on the page to see all of the information about your database, including the hostname, user name and password, and URLs to connect to the database.

You can access this information anytime by going back to your [Dashboard](https://dashboard.render.com/), and clicking on the database instance.

# Phase 4: Create a New Web Service
From the [Dashboard](https://dashboard.render.com/), click on the "New +" button in the navigation bar, and click on "Web Service" to create the application that will be deployed.

_Note: If you set up your Render.com account using your GitHub credentials, you should see a list of applications to choose from. If you do not, click on "Configure Account" for GitHub in the right sidebar to make the connection between your Render and GitHub accounts, then continue. If you run into issues with the GitHub connection, use this article to [reset your GitHub connection](https://community.render.com/t/github-id-belongs-to-an-existing-render-user/2411/1)._

Look for the name of the application you want to deploy, and click the "Connect" button to the right of the name.

Now, fill out the form to configure the build and start commands, as well as add the environment variables to properly deploy the application.

## Part A: Configure the Start and Build Commands
Start by giving your application a name. This is the name that will be included the URL of the deployed site, so make sure it is clear and simple. The name should be entered in kebab-case.

Leave the root directory field blank. By default, Render will run commands from the root directory.

Make sure the Environment field is set set to "Node", the Region is set to the location closest to you, and the Branch is set to "main".

Next, add your Build script. This is a script that should include everything that needs to happen before starting the server.

For this project, enter the following script into the Build field, all in one line:

```
# build script - enter all in one line
npm install &&
npm run render-postbuild &&
npm run build &&
npm run sequelize --prefix backend db:migrate &&
npm run sequelize --prefix backend db:seed:all
```

This script will install dependencies, build the frontend and backend, and run the migrations and seed files.

_Note: Due to limitations of Render.com's free tier, you will be including the seed command within the build. **This should only be done for demo applications, not production applications.** Including the seed command in the build will make it easier for you to replace your free database after it expires every 90 days and will help keep your application in a pristine state with clean seed data._

Now, add your start script in the Start field:

```
npm start
```

## Part B: Add the Environment Variables
Click on the "Advanced" button at the bottom of the form to configure the environment variables your application needs to access to run properly. In the development environment, you have been securing these variables in the .env file, which has been removed from source control. In this step, you will need to input the keys and values for the environment variables you need for production into the Render GUI.

Click on "Add Environment Variable" to start adding as many variables as you need. You will not need to add the `PORT` or `DB_FILE` variables, since those are only used in the development environment, not production.

Add the following keys and values in the Render GUI form:

* JWT_SECRET (click "Generate" to generate a secure secret for production)
* JWT_EXPIRES_IN (copy value from local .env file)
* NODE_ENV production
* SCHEMA (your unique schema name, in snake_case)

In a new tab, navigate to your dashboard and click on your Postgres database instance.

Add the following keys and values:

* DATABASE_URL (copy value from Internal Database URL field)

_Note: Add any other environment variables here. If you work to further develop your project, you may need to add more environment variables to your local .env file. Make sure you add these environment variables to the Render GUI as well for the next deployment._

Next, choose "Yes" for the Auto-Deploy field. This will re-deploy your application every time you push to main.

Now, you are finally ready to deploy! Click "Create Web Service" to deploy your project. The deployment process will likely take about 10-15 minutes if everything works as expected. You can monitor the logs to see your build and start commands being executed, and see any errors in the build process.

When deployment is complete, open your deployed site and check to see if you successfully deployed your Express and React application to Render! You can find the URL for your site just below the name of the Web Service at the top of the page.

# Re-deployment
There are two ways to re-deploy your main branch changes:

1. If you set up your application for Auto-deployment, it should automatically re-deploy after every push to main.

2. You can manually trigger a re-deployment at any time. Click on the blue "Manual Deploy" button and choose "Clear Build Cache & Deploy". You will be able to see the logs and confirm that your re-deployment is successful.

# Ongoing Maintenance
The main limitation of the free Render Postgres database instance is that it will be deleted after 90 days. In order to keep your application up and running, you MUST create a new database instance before the 90 day period ends.

**Set up calendar reminders for yourself to reset your Render Postgres database instance every 85 days so your application(s) will not experience any downtime.**

Each time you get your calendar reminder, follow the steps below.

1. Navigate to your Render Dashboard, click on your database instance, and click on either the "Delete Database" or "Suspend Database" button.

2. Next, follow the instructions in Phase #3 above to create a new database instance.

3. Finally, you will need to update the environment variables for EVERY application that was connected to the original database with the new database information. For each application:

* Click on the application name from your Dashboard
* Click on "Environment" in the left sidebar
* Replace the value for DATABASE_URL with the new value from your new database instance, and then click "Save Changes"
* At the top of the page, click "Manual Deploy", and choose "Clear build cache & deploy".

4. After each application is updated with the new database instance and re-deployed, manually test each application to make sure everything still works and is appropriately seeded.
