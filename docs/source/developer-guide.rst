=================
 Developer Guide
=================

.. _intro:

Introduction
============

This guide documents high level development standards, policies and
procedures without going into lower level details of the source code
and APIs.

.. _prog-lang:

Programming Language
--------------------

The chosen programming language is Javascript both on the backend and
the frontend. Javascript is relatively easy to get started with, it is
increasingly popular to develop web applications and has a growing
wealth of libraries to use to build systems faster. `NodeJS
<http://www.nodejs.org/>`_ is the Javascript backend platform and a
decent starting point and reference for the Javascript language is
provided by the `Mozilla Developer Network
<https://developer.mozilla.org/en-US/docs/Web/JavaScript>`_.

Web Stack
---------

No web application is built without a web framework (or library). The
prototype was built using Bottle/Flask in Python but the production
system will move to NodeJS and `ExpressJS
<http://expressjs.com/>`_. Both are good choices but moving to the
NodeJS has a number of advanges which were important to us including
pervasive use of asynchronous programming on backend and frontend
making it easier to scale with same amount of resources. A road to
unify backend and frontend languages, libraries and devleopment
tooling.

A micro framework was prefered to a full blown and much less flexible
framework such as Django or Ruby on Rails. Applications can be fine
crafted much better with small composable libraries. In addition to
Express, a number of Express plugins are used when needed and
Express middleware pluggins can easily be written when none
appropriate are available.

Database
--------

The CouchDB document database was chosen for its flexibility and
simplicity. CouchDB is one of the several NoSQL database types built
specifically for the web. If you are not familiar with CouchDB have a
look at its website at `https://couchdb.apache.org/
<https://couchdb.apache.org/>`_ and documentation at
`http://docs.couchdb.org/en/latest/. <http://docs.couchdb.org/en/latest/>`_.

Setting Up the Development Environment
======================================

It is pretty easy to setup your own development environment to work on
the Candy Basket tool. Here you will find the necessary steps to get
you started. Essentially, the following subsections can be followed in
order and everything should work.

The latest NodeJS will need to be installed on your operating system
(OS); binaries are available for all popular OSes. Instructions are
given in a platform-agnostic fashion to the extent that it is
possible.

Development Tools
-----------------

You will need you typical development tools: a command line, a text
editor or IDE, a web browser with good development plugins such as the
Google Chrome Javascript console or Firefox's web developer extension
and firebug. It does not matter much which tool, choose the ones
you're most confortable with.

.. _nodejs_npm:

NodeJS and NPM
--------------

NodeJS is the Javascript platform for writing Javascript software on
the backend. The NodeJS package manager in use is `npm
<https://www.npmjs.org/>`_ and the canonical way to install npm
package is locally to whatever software you are developing as opposed
to globally on your operating system. Therefore, use::

  [user]$ npm install express

and not::

  [user]$ npm install -g express

And say you are adding a new dependency to your branch make sure you
save it to the package.json definition with::

  [user]$ npm install --save new-dep

Or if it is a dependency only used during development::

  [user]$ npm install --save-dev new-dep

Some packages are typically better installed globally, however. Once
you have NodeJS installed on your machine you should install bower and
grunt-cli globally::

  [user]$ npm install -g bower
  [user]$ npm install -g grunt-cli

This is all that should be needed as a foundation development
setup. However, if you plan to test the production deploy on your
development machine---and you probably should before doing any pull
request---you will also need a few more global packages.

  [user]$ npm install -g forever 
  [user]$ npm install -g http-server


.. _couchdb:
CouchDB
-------

CouchDB is used as the database for this tool. The easiest way to
install CouchDB is to use the OS' package manager (Debian's apt-get,
Mac OS X's brew, Red Hat's yum). CB makes use of three databases:
`candy_basket_test`, `candy_basket_development`, `candy_basket` (for
production). On the development machine only the
candy_basket_development must be created in advanced (and
`candy_basket` if you plan on testing deploys locally). The
integration tests will create and destroy the `candy_basket_test`
database automatically, in fact, tests will fail if this database is
already present.

Sample data must be added to the development database. This can be
done in a number of ways, either programmatically importing old
candies or manually entering some sample data using the running
development application. The views have to be created manually at the
moment. You can easily just copy and paste the views definition from
the integration tests (i.e. `backend/test/specs/controllers.js`) in
the CouchDB admin web UI.

In the test database sample data is automatically generated as part of
unit tests and the views are also programmatically created before they
are used.

Grunt
-----

`Grunt <http://gruntjs.com/>`_ is use to automate a number of time
consuming tasks. It takes a while to learn but is well worth the
efforts. Included here is a short list of things you will use grunt
for.

Grunt on the backend
~~~~~~~~~~~~~~~~~~~~

First, from the `backend` directory you can execute tests and serve
the backend application.

To run the tests from the backend you will need two terminals since
these contain also integration tests in addition to unit tests. In
both terminals you should set the NODE_ENV to 'test' like this::

  [user]$ export NODE_ENV=test

In one terminal serve the backend in test mode::

  [user]$ grunt serve

And the other terminal you run the tests. Those tests will run against
a test environment (with a test database as configured in
`backend/config.js`)::

  [user]$ grunt test

When simply developing you should only need one terminal to serve the
backend application. But you need to switch the environment to
development wih the following::

  [user]$ export NODE_ENV=development

And then you can serve the backend in development mode::

  [user]$ grunt serve

The nice thing is that you can do all the above at the same time and it
want interfere as test, development and production environments all
use different ports.

Building the backend will clean any previous build, JSHint all the
code, run the tests and prepare all files for production into
`backend/dist` and can be done with the following::

  [user]$ grunt

Grunt on the frontend
~~~~~~~~~~~~~~~~~~~~~

In the frontend, things are very similar, but simpler. There is no
need to set the environment variable from the command line; this is
done within the grunt processes. So, all you really need in the
frontend currently is to run a development web server (this will be in
development mode automatically)::

  [user]$ grunt serve

To run your tests you can::

  [user]$ grunt test

The build process will first clean any previous build, make sure all
the code JSHints, run all tests and then do an impressive number of
optimisations to the application and its dependencies and package it
in `frontend/dist`. The build process is done with::

  [user]$ grunt


Grunt globally in app root
~~~~~~~~~~~~~~~~~~~~~~~~~~

Finally, work has also commenced on automating some other tasks in the
root of the candy-basket application. Currently, it can already do
some really useful things which will be described here.

It can automatically create new releases following some modern
conventions similar to the ones used by the AngularJS team which would
typically be a repetitive number of boring tasks, but not with the
following::

  [user]$ grunt release:patch
  [user]$ grunt release:minor
  [user]$ grunt release:major
  [user]$ grunt release:prerelease

Which one to execute will depend on the work on the recent branches
pulled into master (see :ref:`ongoingdev`). For example, let's
say you pulled 3 branches that address bugs then you could cut a
release with::

  [user]$ grunt release:patch

But if you add new features you might want to cut a release with::

  [user]$ grunt release:minor

And for major upgrades such as those containing backward incompatible
changes::

  [user]$ grunt release:major

For more information on this process you can refer to
\url{https://github.com/geddski/grunt-release} and
\url{http://semver.org/}.

It can automatically generate a CHANGELOG.md file. This is a little
tricky as the `from` and `to` commit hashes must be setup manually in
the `candy-basket/Grunfile.js`'s changelog property to generate to new
part of the CHANGELOG.md and automatically append it to
CHANGELOG.md. The good thing is that if a mistake is done then you can
simply `git checkout CHANGELOG.md` and try again. You can use `git
log` to identify the hash of the last CHANGELOG.md commit which will
be your `from` and the most recent release cut which will be you `to`
and then::

  [user]$ grunt history

Verify that the CHANGELOG.md looks good, do any manual changes you see
fit and commit this CHANGELOG.md to master directly.

It can build the docs if you make any amendments to these source
files::

  [user]$ grunt docs

It can Bbuild the backend, build the frontend, build the docs and move
everything into `candy-basket/dist` ready to be deployed on remote
server::

  [user]$ grunt build

And even do a full deploy of the application which will do a complete
`grunt build` as above and then start the backend and frontend using
forever. For this to work there are a couple of things you need to
have working. First, you will need authbind to enable a non-privileged
OS user to start network services on ports below 1024 (i.e. 443), you
must \emph{not} have anything listening on 4443 and 443 and forever
must be installed. But then it's just a matter of::

  [user]$ grunt deploy

To see services you can::

  [user]$ forever list

And before you try to re-deploy you must stop the services first::

  [user]$ forever stopall

For the installation and configuration of authbind refer to
\url{http://www.debian-administration.org/article/386/Running_network_services_as_a_non-root_user.}
or any number of easy tutorials on how to use authbind.

Dependencies
------------

This application has a number of dependencies but they can all easily
be installed from within the root of your own clone repository and
from the `backend` and `frontend` directories. The production backend
libraries and the development and test libraries are typically always
npm packages with the dependencies clearly defined the `packages.json`
files, one in the backend, one in the frontend and one in the root
directory. In other words, everywhere you see a package.json file you
must change to that directory and install dependencies like this::

  [user]$ npm install

Frontend dependencies, those that will run in the client browser
powering the web UI are installed using the Bower package management
tool. From within the frontend directory you can simply do::

  [user]$ bower install

Those commands are idempotent and it does not matter how often you
execute them. Installing new dependencies for development can be done
with the same tool.

Backend dependencies and frontend development and test libraries::

  [user]$ npm install new-grunt-plugin new-backend-library

Though to save the dependency in the package.json you would do::

  [user]$ npm install --save-dev new-grunt-plugin new-backend-library

Frontend dependencies::

  [user]$ bower install new-angular-third-party-directive

and the same to persist the dependency if you end up keeping it::

  [user]$ bower install --save new-angular-third-party-directive

Some of the packages may have additional lower level dependencies of
their own in which case you would typically have to install some
package on your OS such as xml headers from the development
package. This should be made clear from failures to install
dependencies and is typically quickly addressed by installing from the
OS' software repository (apt, yum, brew, etc.)

Development Work-flow
=====================

The CB project constantly strives to improve its development
operations in order to produce software of higher quality at a more
efficient rate. This part of the developer guide will constantly
evolve and should be kept close at hand when developing on the CB
project.

Software Configuration Management
---------------------------------

All software is managed through Git (Source Control Management) and
Github (Issue tracking, collaboration, etc.) in a publicly accessible
repository. Its location is currently at
`https://github.com/ghachey/candy-basket/
<https://github.com/ghachey/candy-basket/>`_ but it will likely
eventually change to the owning organization Nasara. Until then you
can retrieve your own full local clone of the project with Git
installed on your machine::

  [user]$ git clone git@github.com:ghachey/candy-basket.git

However, never publish work to master (at least as rarely as
possible). The following section describes the procedures to develop
on CB.

.. _ongoingdev:

On-going Development
--------------------

New development work on a software project is either of maintenance
(fixing bugs, addressing security issues) or construction nature
(adding new features). Regardless of the type of work, all new work
should be done in a branch, not on master. For example, let's say
we're tackling issue #3 from the issue tracking system (Trac, Github
Issues, etc.) you should `create a branch
<http://www.git-scm.com/book/en/Git-Branching-Basic-Branching-and-Merging>`_
like this [PRO-GIT]_::

  [user]$ git checkout -b issue3

Work on the issue, add relevant tests so it does not occur again, all
the while only committing locally on your branch. Discuss with team
members the fix if not sure about something. Get team members to
review and refactor code if needed. After all this is done you can go
ahead with publishing your new fix following our defined standard
procedure.

It is desirable to keep the history of master's commits as clean as
possible for more effective code review. The established way of
achieving this is to squash all your local commits from your *issue3*
branch into a single properly formatted commit before publishing
changes and doing a pull request to master. 

`Squashing commits
<http://www.git-scm.com/book/en/Git-Tools-Rewriting-History#Squashing-Commits>`_
in git is straight forward [PRO-GIT]_. However, the consolidated
commit must follow the following conventions adapted from `Google
project AngularJS
<https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#>`_
which will greatly enhanced the historical information on master and
allow for automatic generation of the changelog. The format of the
commit message must follow the following convention::

  <type>(<scope>): <subject>
  <BLANK LINE>
  <body>
  <BLANK LINE>
  <footer>

Any line of the commit message must not be longer than 100
characters. This allows the message to be easier to read on github as
well as in various git tools.

**<type>**

Should be either of the following:

* feat (when working on new feature)
* fix (when fixing a bug or addressing a security vulnerability)
* docs (when working on documentation)
* style (improving formatting, missing semi colons, indentation, etc.)
* refactor (when doing minor or major refactoring work)
* test (when adding missing tests)
* chore (maintain)

**<scope>**

Should specify the location of the commit as succinctly and completely
as possible (e.g. $location, $rootScope, ngHref, ngClick, ngView)

**<subject>**

Subject line contains succinct description of the change. Remember it
must not be longer than 100 characters and this *includes* both the
<type>(<scope>) identified before. Here are some convensions:

* use imperative, present tense: "change" not “changed” nor “changes”
* don't capitalize first letter
* no period full stop (.) at the end

**<body>**

[Optional] Slightly more elaborated description possibly spanning over several
lines never more than 100 characters each.

* just as in <subject> use imperative, present tense
* includes motivation for the change and contrasts with previous behavior

**<footer>**:

[Optional] should include either breaking changes and/or references of
what issues were resolved if any. All breaking changes have to be
mentioned in footer with the description of the change, justification
and migration notes.

The following includes several examples of properly formatted squashed
commit messages.

A new feature commit::

  feat($browser): onUrlChange event (popstate/hashchange/polling)

  Added new event to $browser:
  * forward popstate event if available
  * forward hashchange event if popstate not available
  * do polling when neither popstate nor hashchange available

  Breaks $browser.onHashChange, which was removed (use onUrlChange instead)

A fix for browser compatibility commit::

  fix($compile): couple of unit tests for IE9

  Older IEs serialize html uppercased, but IE9 does not...
  Would be better to expect case insensitive, unfortunately jasmine does
  not allow to user regexps for throw expectations.

  Closes #392
  Breaks foo.bar api, foo.baz should be used instead

A new feature request from issue #351 commit::

  feat(directive): ng:disabled, ng:checked, ng:multiple, ng:readonly, ng:selected

  New directives for proper binding these attributes in older browsers (IE).
  Added coresponding description, live examples and e2e tests.

  Closes #351, #456

Some cleanup commit::

  style($location): add couple of missing semi colons

Some documentation work commit::

  docs(guide): updated fixed docs from Google Docs

  Couple of typos fixed:
  * indentation
  * batchLogbatchLog -> batchLog
  * start periodic checking
  * missing brace

A new feature with major breaking changes::

  feat($compile): simplify isolate scope bindings

  Changed the isolate scope binding options to:
  * @attr - attribute binding (including interpolation)
  * =model - by-directional model binding
  * &expr - expression execution binding

  This change simplifies the terminology as well as
  number of choices available to the developer. It
  also supports local name aliasing from the parent.

  BREAKING CHANGE: isolate scope bindings definition has changed and
  the inject option for the directive controller injection was removed.

  To migrate the code follow the example below:

  Before:

  scope: {
    myAttr: 'attribute',
    myBind: 'bind',
    myExpression: 'expression',
    myEval: 'evaluate',
    myAccessor: 'accessor'
  }

  After:

  scope: {
    myAttr: '@',
    myBind: '@',
    myExpression: '&',
    // myEval - usually not useful, but in cases where the
    // expression is assignable, you can use '='
    myAccessor: '=' // in directive's template change myAccessor() to myAccessor
  }

  The removed `inject` wasn't generaly useful for directives so there should be no code using it.

For example, you've been working on your branch and made three commit
with vague non-useful messages such as "Work in progress", "Small
fix", etc. You want to wrap up the work with a nice single squashed
commit following the above format. You can use Git's rebase tool::

  [user]$ git rebase -i HEAD~3

This will pull open an editor with something like the following::

  pick f7f3f6d Work on docs
  pick 310154e Work in progress
  pick a5f4a0d Small fix

  # Rebase 710f0f8..a5f4a0d onto 710f0f8
  #
  # Commands:
  #  p, pick = use commit
  #  r, reword = use commit, but edit the commit message
  #  e, edit = use commit, but stop for amending
  #  s, squash = use commit, but meld into previous commit
  #  f, fixup = like "squash", but discard this commit's log message
  #  x, exec = run command (the rest of the line) using shell
  #
  # These lines can be re-ordered; they are executed from top to bottom.
  #
  # If you remove a line here THAT COMMIT WILL BE LOST.
  #
  # However, if you remove everything, the rebase will be aborted.
  #
  # Note that empty commits are commented out
 
To squash the three commits into one you would edit the script to look
like this::

  pick f7f3f6d Work on docs
  squash 310154e Work in progress
  squash a5f4a0d Small fix

  # Rebase 710f0f8..a5f4a0d onto 710f0f8
  #
  # Commands:
  #  p, pick = use commit
  #  r, reword = use commit, but edit the commit message
  #  e, edit = use commit, but stop for amending
  #  s, squash = use commit, but meld into previous commit
  #  f, fixup = like "squash", but discard this commit's log message
  #  x, exec = run command (the rest of the line) using shell
  #
  # These lines can be re-ordered; they are executed from top to bottom.
  #
  # If you remove a line here THAT COMMIT WILL BE LOST.
  #
  # However, if you remove everything, the rebase will be aborted.
  #
  # Note that empty commits are commented out

When saving this you will return to a text editor where you can merge
the commit messages seeying something like this ::

  # This is a combination of 3 commits.
  # The first commit's message is:
  Work on docs

  # This is the 2nd commit message:

  Work in progress

  # This is the 3rd commit message:

  Small fix
 
Those commits are practically useless in the grand scheme of
things. You want to replace it with a single properly formatted
message following above conventions. In this case you would remove the
above from the text editor and replace it with something like the
following::

  docs(developer-guide.rst): update docs with new code base refactory

  What's changed in details:
  * Change backend section to reflect migration to NodeJS
  * Refactor various part of guide with new content
  * Introduce new conventions and standards

Save this nicely formatted commit and then you're ready to publish
your work and do a pull request::

  [user]$ git push

Although if you were working entirely on a detached local branch like
I do you would need to push like this instead::

  [user]$ git push --set-upstream origin replace-this-with-branch-name

Do the pull request from github and use the last commit as the message.

Application Deployment
----------------------

Automation for optimized deployment is currently in the works and
nearly working. The `backend` can be grunt deployed. The `frontend`
can be grunt deployed in a highly optimized fashion following Google's
best practice for making the web faster. The optimized frontend
deployment works *almost*. There remains a couple of tricky bits to
address but it is mostly working except a couple of noticeable things:
keystrokes with the Timeline are not working, angular-bootstrap
templates are not accessible and so the modal and slider are not
working as expected.

The only requirements for Candy Basket to work in production are the
`NodeJS <http://nodejs.org/>`_ platform, `grunt-cli
<https://github.com/gruntjs/grunt-cli>`_ Grunt's command line
interface, `forever <https://github.com/foreverjs/forever>`_ to run
node applications reliably and `http-server
<https://www.npmjs.com/package/http-server>`_ small light weight and
fast HTTP server::

  [user]$ npm install -g grunt-cli
  [user]$ npm install -g forever
  [user]$ npm install -g http-server

The process to build the backend can be done individually (not yet
executing tests first)::

  [user]$ cd candy-basket/backend/ 
  [user]$ grunt

The process to build the frontend can be done individually also:: 

  [user]$ cd candy-basket/frontend/ 
  [user]$ grunt

And the whole Candy Basket application can be deployed including
executing test, building docs, building backend, building frontend and
copying all files to `candy-basket/dist`::

  [user]$ cd candy-basket/
  [user]$ sudo su
  [root]# grunt deploy

Currently, the application must be started as user root. The next step
would be either to use iptables to redirect 80 to 8080 and start user
as non-privileged one or use authbind. Optionally, another tasks could
be added to move it to the desired location on the server.

Services are started on port 4443 (backend) and 443 (frontend) so
those port must not be taken. The application only functions on https
with currently no redirect from http.



High Level Architecture
=======================

Briefly, this application is composed of two main parts: a computer
consumable service on the backend (i.e. runs on the server) and a
human consumable service on the frontend (i.e. runs in the
browser). The backend is a NodeJS powered RESTful service and the
frontend is an HTML, CSS and Javascript Web User Interface (UI)
capable of talking to the backend.

* README.md -- A brief introduction and pointers
* LICENSE.md -- GNU General Public License version 3
* CHANGELOG.md -- Automatically generated change logs
* backend -- The NodeJS RESTful service
* frontend -- The AngularJS Web application
* docs -- The documentation for this project 
* package.json -- Root meta data JSON file
* Gruntfile.js -- Grunt task automation file common to backend and frontend 

.. _rest-service:
Backend -- The RESTful Service
------------------------------

The backend is written entirely in the Javascript programming language
implementing a simple RESTful service. The backend is a RESTful
service following a Resource Oriented Architecture (ROA) as defined in
[REST-SERV]_. The following tables describe its service. Note that no
API version number is included in the URI; it will be included in the
host as `http://candy-restapi-v1.pacificpolicy.org.vu/
<http://candy-restapi-v1.pacificpolicy.org.vu/>`_.

User Account Service
~~~~~~~~~~~~~~~~~~~~

Each organisation can have a number of users using the tool. However,
user management is usually done using an external service such as
Active Directory or another LDAP service like OpenLDAP. Candies do not
yet have ownership and are globally accessible by the organisation
once authenticated.

The URI design goes like this. A "basket" refers to the whole
organisation. In other words, organisations have their private basket
of candies. An organisation (and therefore a basket) can have many
users; the organization and its users can be represented as
/basket/users/, but this will not be used at first. All candies are
associated to a user and are (at least at first) accessible to any
authenticated staff.

The services offer no CRUD operations on users at the moment as this
is considered to be done using an external service (Active Directory,
OpenLDAP).


Source (Candies) Service
~~~~~~~~~~~~~~~~~~~~~~~~

This is the main service of candy basket: users can add "source(s)"
and tag them. A source can have a URL, file(s), title description and
tags. In the technical world of Candy Basket (such as in the source
code) sources are typically referred to as candies; they are exactly
the same thing. In the UI the term source is used.

+--------------------------+------------------------------------------------+
| Operation                | HTTP Method and URI                            |
+==========================+================================================+
| Create a source          | POST /basket/candies                           |
+--------------------------+------------------------------------------------+
| View a source            | GET /basket/candies/{uuid}                     |
+--------------------------+------------------------------------------------+
| Modify a source          | PUT /basket/candies/{uuid}                     |
+--------------------------+------------------------------------------------+
| Delete a source          | DELETE /basket/candies/{uuid}                  |
+--------------------------+------------------------------------------------+


Utilities Service
~~~~~~~~~~~~~~~~~

Only a couple of utility aggregates are needed at the moment.

+-----------------------------------+-----------------------------------------+
| Operation                         | HTTP Method and URI                     |
+===================================+=========================================+
| Fetch all sources                 | GET /basket/candies                     |
+-----------------------------------+-----------------------------------------+
| Fetch all tags                    | GET /basket/candies/tags                |
+-----------------------------------+-----------------------------------------+
| Fetch all tags by candies         | GET /basket/candies/tags-by-candies     |
+-----------------------------------+-----------------------------------------+


When developing it is often useful to use the RESTful API
directly. Here are some example usage.

Fetching all candies::

  [user]$ curl --user candy:P@55word -X GET http://localhost:3003/basket/candies

Fetching a candy::

  [user]$ curl --user candy:P@55word -X GET http://localhost:3003/basket/candies/03c0b670e5c56bfb461a76dcf7000d1c

Creating a candy::

  [user]$ curl --user candy:P@55word
               -X POST \
               -H "Accept: application/json"  \
               -H "Content-Type: application/json" \
               -d @candy.json \
               http://localhost:3003/basket/candies

Where candy.json would be the JSON candy in a file named candy.json
accessible within the directory from which curl command is being
executed. Routes only accept JSON at the moment.  It could look
something like this::

  {
    "source": "http://www.ghachey.info",
    "title": "Ghislain Hachey Website",
    "description": "A bit updated",
    "tags": ["gh","ict","website"]
  }

Or an invalid candy (dangeous scripts)::

  {
    "source": "http://www.ghachey.info",
    "title": "Ghislain Website",
    "description": "<script>alert(\"Hacked onced, shame on you.\");</script>",
    "tags": [
      "Website",
      "Ghislain Hachey"
    ]
  }

If you want to test uploading the easiest is to use the frontend
directly. Otherwise, you could build a request yourself with curl by
setting the `Content-Type` to `multipart/form-data` and the additional
JSON data which would be something like this::

  "files":[{"name":"0bf6198aac462ddbb12add63fff0d8c2.pdf",
            "originalName":"Artificial Intelligence Search Algorithms.pdf"},
           {"name":"7fde008c066d3ed6226d5a88b2f1e7ef.png",
            "originalName":"linkedin.png"}]

Where the name is a UUID generated by the frontend upload code and the
original name is also kept. The file would be sent to the ownCloud
with the unique name but could be listed and retrived using the
original name.

Updating a candy::

  [user]$ curl --user candy:P@55word
               -X PUT \
               -H "Accept: application/json"  \
               -H "Content-Type: application/json" \
               -d @candy-update.json \
               http://localhost:3003/basket/candies/id-of-candy-in-couchdb

Where id-of-candy-in-couchdb is the id automatically created on POST
and returned in the Location header for latter retrieval. It can be
retrieved in a number of ways. Looking at data in the DB is fairly
easy and quick. The newly updated candy could look like this::

  {
    "_id": "id-of-candy-in-couchdb"
    "source": "http://www.ghachey.info",
    "title": "Ghislain Hachey Website",
    "description": "A bit updated--oups, I meant a bit outdated",
    "tags": ["gh","ict","website"]
  }

This would completely replace the previous document. For example, if
you had a `files` data in the JSON document and none in the update
then that data would no longer be present. A complete update on a
document containing also files could be achieved with a minimum couple
of async curl requests. First the file upload(s)::

  [user]$ curl --user candy:P@55word
               -X POST \
               -H "Content-Type: multipart/form-data; boundary=---------------------------11936647625814307171179269292" \
               --data-binary @test.txt \
               http://localhost:3003/files

And then the actual candy::

  [user]$ curl --user candy:P@55word
               -X PUT \
               -H "Accept: application/json"  \
               -H "Content-Type: application/json" \
               -d @candy-update.json \
               http://localhost:3003/basket/candies/id-of-candy-in-couchdb

Frontend -- Web UI Application
------------------------------

The Frontend is developed using the AngularJS web framework with
community Angular modules and our own code. The frontend code based is
organised following Angular community best practices.

* `frontend/app/scripts/app.js`: this is where the application is
  bootstrapped. It contains some configuration and some routes
  definitions.
* `frontend/app/scripts/services/`: this directory contains
  application services.
* `frontend/app/scripts/controllers/`: this is where the business
  logic resides; no DOM manipulation should happen here.
* `frontend/app/scripts/filters/`: this where filters are stored often
  used has a final filtering step before presenting the data
  (e.g. money and date conversions formatters). It can also include
  data filtering code.
* `frontend/app/scripts/directives/`: this is where you can manipulate
  the DOM as you wish. Think of directives as a means to extend HTML
  and browser capabilities for web *applications*.
* `frontend/app/index.html`: is the base HTML file for the whole
  application
* `frontend/app/views/`: contains all the other HTML partials that
  make up the rest of the application.
* `frontend/app/styles/`: contains custom styles
* `frontend/app/images/`: contains images
* `frontend/test/specs/`: where unit tests resides. Directories in there
  mirrors the content of the `frontend/app/scripts/`

Low Level Documentation and API
===============================

The lower level documentation about software design, application
programming interfaces, small gotchas and all other nitty-gritty
details about the source code is written directly inside the source
code. It can be extracted and exported to hard copy formats such as
HTML or PDF and eventually may be integrated with this documentation
also. But currently the place to access it is directly inside the
source code for two main reasons: the JSDoc generators by default
generate incomplete mostly useless and ugly HTML output and since this
is not intended to be used by others as a public API it's not worth
the effort of extracting these lower level docs.  

Documentation
=============

Higher level documentation is prepared using an excellent tool
developed in the Python world called Sphinx `http://sphinx-doc.org
<http://sphinx-doc.org>`_ which uses the reStructuredText markup
language `http://sphinx-doc.org/rest.html
<http://sphinx-doc.org/rest.html>`_. Sphinx outputs to HTML and PDF
but could also output to other formats.

In the docs folder there is a ``source`` directory which contains the
source files with the markup content; this is where the documentation
is written. The ``build`` directory is where the documentation is
produced either in PDF, HTML or other supported format. 

If you plan on producing documentation you will need to install
Sphinx. Sphinx is written in `Python <https://www.python.org/>`_ can
the easiest way to install it is to install Python and `pip
<https://github.com/pypa/pip>`_ and then execute the following to
install globally::

  [user]$ sudo pip install sphinx

Outputs are generated using a simple make command from within the
``docs`` directory::

  [user]$ make latexpdf
  [user]$ make html

Or simply type ``make`` to get a list of other options. If you wish
you generate PDF you will need to install the Tex type setting system
along with LaTeX, but this is optional. How to do this will largely
depend on your OS. There is usually a very large all in one package
available for popular OSes either packaged as binary or directly
available through the OS' package manager.

However, if you have Sphinx installed there is no longer any need to
manually build the docs. You can simply use Grunt from the
candy-basket root directory like this::

  [user]$ grunt docs

All source code including the application programming interface is
documented in a modern Javascript fashion using a jsdoc style with
AngularJS additional conventions on the frontend. This has a number of
advantages including keeping the documentation directly with the code
and more in sync, preparation of AngularJS style documentation with
the ability to add example usage, online discussions and a number of
others things not readibly available when simply using Sphinx. When
writting source code simply document it following `AngularJS
<https://github.com/angular/angular.js>`_ and `jsdoc
<http://usejsdoc.org/>`_ styles and the production of the online
documentation is currently not being done as it provides little added
value. If you're interested in lower level development details the
place to look at now is the source.

.. _security:
Security Considerations
=======================

Since Candy Basket will be used as a tool by organizations with
varying degrees of security requirements it must be designed and
evolve with a number of security considerations in mind and the aim of
constantly improving its security status quo.

If you are interested in helping contribute code to Candy Basket we
provide some mininum security related recommendations, guidelines and
procedures to follow.

Authentication
--------------

The backend currently supports only HTTP Basic Authentication on every
single endpoint. It is critical to properly setup SSL/TLS to encrypt
all communication between the client (frontend) and the server
(backend). It makes use of a single user called `candy` to
authenticate the frontend with the backend which is configurable in
`backend/config.js`. Therefore, users authenticated to the frontend
through some LDAP single sign-on mechanism will then automatically
have access to data from backend. In other words, no access to
frontend, no access to backend either.

SSL/TLS Encryption
------------------

This application is moving towards a strict and mandatory use of
encryption throughout all its the various components .  Self-signed
keys and certificates are used for development and test and the
equivalent of curl's --insecure flag is set when executing requests in
those modes. This insecure flag is off by default in production. 

ownCloud
~~~~~~~~
 
Candy Basket uses ownCloud as file storage. Connections to ownCloud
must be encrypted. Developers can use their own local ownCloud server
for development and test though will have to include their own
certificate in the `backend/certificates` directory and change the
config.js. The certificate to make use of the pacificpolicy.org
ownCloud server is also included. Casre must be taken with the
configuration of the ownCloud server to enforce secure connections at
all times.

Nasara backend
~~~~~~~~~~~~~~

The backend now also supports encryption. In fact, it only listens on
https, period (port 3003 for test and development and 443 for
production). A set of development keys was generated which can be use
for just development and test without change in the
`backend/config.js`. Both the private key and public certificate are
committed to the repo for development and test convenience. Needless
to say they should not be used in production. A new set should be
used, either self signed or both from a CA depending on the context
and target users.

Nasara frontend
~~~~~~~~~~~~~~~

To access the backend with the self-signed certificate in development
from AngularJS the browser needs to confirm the insecure connection
(like curl's --insecure or NodeJS's
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'). Only once you will
have to point the browser directly to the backend by putting the
address `https://localhost:3003/` in the URL address bar.

Latest Top 10 Security Risks
----------------------------

An initial security assessment determined that this application was
designed with all the security basics in mind although tighthening
security should always remains an objectif as he project
evolves. Candy Basket was measured against OWASP's most up-to-date
`Top 10 Security Risks
<https://owasp.org/index.php/Top_10_2013-Table_of_Contents>`_. It is
important to re-assess Candy Basket towards this top 10 list every
year (or whenever it is revised). Any change should be carefully
examine to make sure Candy Basket still covers all of them
with details reflected in this documentation.

Injection
~~~~~~~~~

General information can be found at `A1 -- Injection
<https://owasp.org/index.php/Top_10_2013-A1-Injection>`_. Candy Basket
makes all necessary efforts to validate data both in the frontend and
the backend to prevent any injection through its communication with
its data store.

Automated scanners can do a good job but should be combined with
manual code review for completeness.

Broken Authentication and Session Management
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

General information can be found at `A2 -- Broken Authentication and
Session Management
<https://owasp.org/index.php/Top_10_2013-A2-Broken_Authentication_and_Session_Management>`_. All
authentication and session management of the application
(i.e. frontend) is left at the Active Directory level through Kerberos
and Apache. This setup should be verified at each upgrade to make sure
it is updated and working as expected. Also make sure that only the
frontend can communicate with the backend at the web server
configuration level.

Strict adherence to recommendations in `A2 -- Broken Authentication
and Session Management
<https://owasp.org/index.php/Top_10_2013-A2-Broken_Authentication_and_Session_Management>`_
is a good start. Anybody working on Candy Basket should have in their
possession the VMware network lab: a Windows 2008 Server (AD, DNS...),
A Debian server (Apache, Kerberos to host Candy Basket ), a Windows 7
workstation, a Windows 8 workstation, any other network node useful in
testing authentication and sessions.

XSS
~~~

General information can be found at `A3 -- Cross-Site Scripting (XSS)
<https://owasp.org/index.php/Top_10_2013-A3-Cross-Site_Scripting_(XSS)>`_. Candy
Basket covers this one much like protecting agains injections:
frontend and backend data validation, automatic sanitization of rich
content, and appropriate escaping of untrusted data.

A mix of automated tools and manual code review can be employed for
Integrated Penetration Testing.

Security Misconfiguration
~~~~~~~~~~~~~~~~~~~~~~~~~

General information can be found at `A5 -- Security Misconfiguration
<https://owasp.org/index.php/Top_10_2013-A5-Security_Misconfiguration>`_. There
is a lot to keep track of here: OS configuration, Web server and
modules configuration, Candy Basket application configuration, third
party libraries default security related configuration. A simple
change to the Candy Basket code base making use of the configuration
variables could open up an easy security hole. For example, in DEBUG
mode the application accepts a non existant Origin header to make
testing of backend with curl straight forward. If this were left
unchanged in production an attacker could execute cross-domain
requests simply by removing the Origin completely in its
reponses. It's all too easy to write a single line of code that can
result in this; I wrote one myself and left it there for about 15
minutes until I realised the consequence.

Regular overview of all the configuration from low to high level
should be integrated into the develop, test and deploy cycle. A grep
on DEBUG on the whole Candy Basket code base might help in identifying
unsafe code. The use of scanners on the OS and Web server
(e.g. Nessus) can be useful. The important thing is the have solid and
fast development operations in place with the ability to deploy in new
secure environments that can be quality tested in quick cycles.

Sensitive Data Exposure
~~~~~~~~~~~~~~~~~~~~~~~

General information can be found at `A6 -- Sensitive Data Exposure
<https://owasp.org/index.php/Top_10_2013-A6-Sensitive_Data_Exposure>`_. Most
sensitive user data is handled at the Active Directory level. Securing
this aspect means keeping the Windows (or Samba4) server updated and
properly configured. The information in the database (aka. the
candies) can often also be considered sensitive information and is
secured through a combination of all the security mechanisms in
place. Otherwise, data can be accessed in a number of ways::

* CouchDB only listens on the local interface but this could further
  be tightened.
* The backend has access to the data so should be secure. At the
  moment, its access is restricted to the frontend through Apache directives.
* The frontend can access data through the backend but the user must
  be authenticated with an Active Diretory to access the frontend.

Missing Function Level Access Control
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

General information can be found at `A7 -- Missing Function Level
Access Control
<https://owasp.org/index.php/Top_10_2013-A7-Missing_Function_Level_Access_Control>`_. Candy
Basket does not do much in terms of Access Control. Either the user
has access to the application or not. This significantly reduces the
complexity and therefore the attack vectors. 

Make sure all other risks are properly addressed and this one should
be covered.

Cross-Site Request Forgery (CSRF aka. XSRF)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

General information can be found at `A8 -- Cross-Site Request Forgery
(CSRF aka. XSRF)
<https://owasp.org/index.php/Top_10_2013-A8-Cross-Site_Request_Forgery_%28CSRF%29>`_.
A number of mechanisms exist with varying degrees of strength to
protect against CSRF. The present status quo with Candy Basket can
best be explained by summarising an email dialogue between Dan McGarry
and Ghislain Hachey::

> It is possible to protect against CSRF by checking the origin header,
> but since this could be spoofed it would only be a first line of
> defence. From my understanding, the highest form of security against CSRF
> is making use of secret tokens first generated by the server and sent
> on each request from the application (which is the number one
> recommendation of OWASP. However,
> according to Angular developers the above scenario is typical of
> non-CORS applications where cookie-based authentication is used
> (i.e. cases most vulnerable to CSRF attacks).  We have a different use
> case: one, we are CORS enabled (`http://www.mnemonic.com` talking to
> `http://rest.mnemonic.com`); two, we do not make use of cookie-based
> authentication but make use of authentication at the Apache level
> using kerberos and AD. While CORS alone is not a protection against
> CRSF, the first line of defence herein (i.e. checking origin) would
> make it quite hard for an attacker who would have to *both* spoof the
> origin *and* trick the user into clicking a malicious page executing
> it when logged into AD at work or on a VPN.
>
> I looked into alternatives to further secure the CSRF weakness and
> found out about the use of XSRF-TOKEN. In short, the server generates
> a secret token which is passed to Angular on the first request as a
> cookie which is then returned by Angular on each request in a header
> (i.e. X-XSRF-TOKEN). Server then verifies header matches cookie on
> each request and if so considers the user legitimate (since only
> Javascript running in the user browser could know the original
> token). However, according to angular this is typically a non-CORS use
> case and Angular does not bother returning the token I created on the
> server in the request header because we do cross-domain requests
> making our use case a bit more painful when it comes to using this type
> of protection. See
> <http://docs.angularjs.org/api/ng/service/$http> and
> <https://github.com/angular/angular.js/issues/5122>.
> 
> My take on it is that we have a relatively non-typical use case:
> de-coupled REST server with single page web application authenticating
> with Apache/Kerberos/AD. I see two possible paths we could take:
> 
> 1) To secure this to my taste I would make it "impossible" to talk to
>    the REST server from anything but the frontend application
>    (essentially what CORS aims except it does not offer protection
>    against spoofing). At the moment, this is enforced at the web
>    server level but does not protect against sophisticated
>    spoofing. The angular application would make use of a user which
>    would authenticate to the backend through robust use of token-based
>    authentication. Token-based authentication has a number of
>    advantages over the currently prevalent use of cookie-based
>    authentication (good reads here
>    <http://www.jamesward.com/2013/05/13/securing-single-page-apps-and-rest-services>,
>    <http://blog.auth0.com/2014/01/07/angularjs-authentication-with-cookies-vs-token/>). Another
>    advantage of doing this would be to take Candy Basket one step
>    closer to a "public offering" and not just an "enterprise
>    offering".
> 
> 2) Another more hackish method is to force Angular to send the
>    XSRF-TOKEN by intercepting and adding headers on each XHR. However,
>    the angular folks specifically deactivated this as they essentially
>    say it should not be done like this and stated it was causing
>    problems with the CORS pre-flights (CORS makes use of pre-flight
>    OPTIONS requests to check whether non-safe requests such as POST,
>    PUT and DELETE are allowed by the origin). This approach would
>    secure the backend and frontend integration against spoofing but is
>    not my preferred options.

In conclusion, Candy Basket's current CSRF protection of checking the
Origin on the server side and only allowing the frontend access to the
backend seems adequate. Even if the attacker manages to spoof the
origin *and* trick the user into clicking a malicious link disguised as
cute kittens, the backend would refuse the request---even when the user
is authenticated---based on restrictions at the Apache level
(i.e. only the frontend application can talk to the backend).

Using Components with Known Vulnerabilities
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

General information can be found at `A9 -- Using Components with Known
Vulnerabilities
<https://owasp.org/index.php/Top_10_2013-A9-Using_Components_with_Known_Vulnerabilities>`_.

Candy Baskets is based on a number of libraries each of which could
potentially have security vulnerabilities. While it is often
impractical to constantly assess all third party libraries it is easy
to subscribe to some kind of communication channels and observe the
evolution of all the components used in your software. Communication
channels could be either mailing lists, social networks or the github
issues tracker.

If there are discovered security vulnerabilities---those that are of
actual real life concern---they will often be announced through the
project's communication channels. You should at the very least follow
announcements of the following projects:

* Angular (and all its modules which are usually upgraded in sync)
* D3 and D3 Cloud
* JQuery
* MomentJS
* UI Bootstrap
* UndercoreJS
* CouchDB
* The hosting Platform (OS, Web server, Modules...)

Whenever any of the above project announces a security vulnerability
there should be an upgrade in process. Typically, very little change
will be required, sometimes a simple matter of executing a `bower
upgrade` and a re-deploy. At times, you may be faced with breaking
changes which will require you to also upgrade the Candy Basket code.

All the above third libraries take security seriously. If you plan on
integrating a new library to add features to Candy Basket a good deal
of consideration must be given to the security aspect of the new
library. Adopting a project with little regard to security should be
*always* avoided.

Unvalidated Redirects and Forwards
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

General information can be found at `A10 -- Unvalidated Redirects and
Forwards
<https://owasp.org/index.php/Top_10_2013-A10-Unvalidated_Redirects_and_Forwards>`_. Candy
Basket makes almost no use of redirects and forwards and no use of
dangerous redirects and forwards (using destination parameters based
on users or other dynamic variables).

Avoid using all but the most simple forwards and redirects. For
example, a redirect to the list view on save or cancel operation is
fine but avoid anything else for the moment. This will depend on the
future direction of Candy Basket.

Miscellaneous and Application Specific
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

There are a number of security considerations that were not part of
the top 10 list but that do apply to our specific use case. Those
should be documented here:

* We make use of JSON as the data interchange format. JSON contains a
  `subtle vulnarability
  <http://haacked.com/archive/2008/11/20/anatomy-of-a-subtle-json-vulnerability.aspx>`_
  when returning data as an array. Angular offers a way to address
  this issue by prefixing all JSON requests with the string ")]}',\n"
  as described `here
  <http://docs.angularjs.org/api/ng/service/$http>`_. We simple always
  return an JSON object instead. For example, if we want to return an
  array of Candies we would send something like {"data" : ["candy1",
  "candy2"...]} and transform the request in Angular to process the
  array.


Integrated Penetration Testing
------------------------------

The above guidelines and procedures should offer an excellent starting
point to ensure a secure web application. Of course, securing a web
application should not stop here. We would like to see a more
integrated penetration testing process. There are a number of tools
that can be used to help support this process. Most of those tools
have a relatelively steep learning curve but they are worth the time
investment.

After some time evaluating several free software tools that were
either recommended by OWASP or considered promising projects we have
come up with a short list of tools to watch:

* `OWASP Zed Attack Proxy Project (ZAP) <https://www.owasp.org/index.php/OWASP_Zed_Attack_Proxy_Project>`_
* `OWASP CSRFTester <https://www.owasp.org/index.php/Category:OWASP_CSRFTester_Project>`_
* `OWASP WebScarab <https://www.owasp.org/index.php/Category:OWASP_WebScarab_Project>`_
* `Vega <http://www.subgraph.com/>`_ a fork of Google Researchers' Skipfish backed up by
  commercial support. A younger but promising project which seem
  easier to use at first glance.

One or more of those tools should eventually be integrated into the
development process. At first only making use of simple features such
as automated scans and slowly integrating more complicated robust
testing processes one by one. As these new processes come to live they
should be clearly documented here with instructions on how to use the
tools.

.. [REST-SERV] Leonard Richardson and Sam Ruby, RESTful Web Services, O’Reilly, May 2007.

.. [FHS] Rusty Russell, Daniel Quinlan and Christopher Yeoh, Filesystem Hierarchy Standard 2004, freestandards.org 

.. [PRO-GIT] Scott Chacon, Pro Git,Available at http://www.git-scm.com/book,
Apress.
