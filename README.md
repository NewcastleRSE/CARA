# CARA
**Comprehensive Assessment of Reading in Aphasia**

CARA is developed from a research project, based within Speech and Language Sciences at Newcastle University, examining reading comprehension with people with aphasia. This digital editon is capable of dynamically producing reports of subject performance as they complete each stage of the assessment.

#### Developers

[Mark Turner](https://github.com/markdturner)  
[Stephen Dowsland](https://github.com/sdowsland)  
[Mike Simpson](https://github.com/mdsimpson42)

#### Researchers

[Julie Morris](https://www.ncl.ac.uk/ecls/staff/profile/juliemorris.html#background)  
[Janet Webster](https://www.ncl.ac.uk/ecls/staff/profile/janetwebster.html#background)

## Development Build

The application is built on AngularJS (Angular 1). It uses NPM & Bower for its package management and Grunt for its build process.

#### Docker

It is advised to use Docker as it provides a clean development environment away from the specifics of the development machine.

1. Build the Dockerfile by running the build script at the root level using

    ```
    ./build.sh
    ```

    This creates a Docker image tagged as `cara:latest`

2. Start a container using that image

    ```
    docker-compose -f docker-compose-dev.yaml up -d
    ```

3. Enter the container

    ```
    docker-compose -f docker-compose-dev.yaml exec client bash
    ```

    The source code is mounted at `/usr/local/app` which is the current directory when entering the container.
    
4. Start the application

    ```
    grunt serve
    ```
    
    This will run a number of validation tasks on the code and start the application on port 9000. To view the application go to [http://localhost:9000](http://localhost:9000)

#### Run Locally

If you wish to not use Docker and run the code on your local environment use the following steps.

1. Install the latest long term support version of node. Using [Node Version Manager](https://github.com/creationix/nvm) is probably the best way of doing this.

2. Install [Ruby](http://www.ruby-lang.org/en/downloads/) and [Compass](http://compass-style.org/install/) for SASS compilation.

3. Install globally required packages. 
    
    ```
    npm install -g grunt-cli bower
    ``` 
    
4. Download and install all project dependencies.
    
    ```
    npm install
    ``` 
    
5. Download and install all browser dependencies.
    
    ```
    bower install
    ```
    
6. Run validatoin tasks and start web server

    ```
    grunt serve
    ```

7. To seed the applciation with a completed report, copy the JSON from `app/data/example-report.json` into your browser's application storage. Use a key of `rca-assessment-0` and a value of the copied JSON.

## Production Build

The production build can be done in either Docker or the local environment using the instructions above.

1. In place of using `grunt serve` instead use the default task by calling `grunt` with no task name.

2. The compiled code will be placed into the `dist` folder at the root level.

## Production Environment

Once a production build has been completed, copy the contents of the `dist` folder into the git repo at `git@gitlab.ncl.ac.uk:computingwebfarm/cara.git`. Access is controlled by NUIT and can be requested by raising a ticket with NU Service.
