OVERVIEW:
This is a Node application with a React/Redux/Thunk front-end and a MySql
database.  I used Gulp for the build process, which incorporates Browserify,
Babel, and minifies scripts and css.  The site is responsive, and works across
browsers.

PREREQUISITES:
Node and MySql are required to be installed for this application to run.

INSTALLATION:
To set up the database, first run the setup.sql script under database/setup.
This will set up both "rover" and "rover_test" databases with users.  Then, the
remainder of the scripts need to be run on both databases, starting with the
rover.sql script under database/create, which will set up the database
structure, and then all the stored procedures under database/sprocs.  The
clean.sql procedure under the test folder only needs to be run on "rover_test".

To build the website, open a command prompt to the project directory.
Execute "npm install" to install the node modules, and then "gulp" to build
the front-end.

EXECUTION:
Open a command prompt to the project directory, and execute
"set node_env=production".  Then run "node app".  The
default port is 3000, so the site can be accessed via http://localhost:3000.
The environment can also be set to "development" or "test".

To import data from the CSV, execute "node app import".  The data from the
CSV will be imported to the database, and the site will also run.

TESTS:
Some of the tests require the application to be running.  The application
should be started with node_env=test (see EXECUTION section above) before unit
tests are run as the unit tests will wipe the database and repopulate data.
To run the test suite, open a command prompt to the project directory and
execute "npm test".
