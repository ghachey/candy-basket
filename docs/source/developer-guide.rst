=================
 Developer Guide
=================

.. _intro:
Introduction
============

The idea is to develop a very user friendly tool to help people dump
thoughts in a flexible database for later use. It works in a similar
fashion as Delicious. The tool is called Candy Basket hereafter
referred to as CB. This service was built using a number of modern
technologies which are described herein.

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
(OS), binaries are available for all popular OSes. Instructions for
devleopers are given in a platform-agnostic fashion to the extent that
it is possible. However, instructions for systems administrators will
aims at being more specific in the administrator's guide.

Development Tools
-----------------

You will need you typical development tools: a command line, a text
editor or IDE, a web browser with good development plugins such as the
Google Chrome Javascript console or Firefox's web developer extension
and firebug. It does not matter much which tool; choose the ones
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

There are a couple of exception to this. Once you have NodeJS
installed on your machine you should install bower and grunt-cli
globally::

  [user]$ npm install -b bower
  [user]$ npm install -b grunt-cli

This is all that should be needed as a foundation development setup.

.. _couchdb:
CouchDB
-------

CouchDB is used as the database for this tool. The easiest way to
install CouchDB is to use the OS' package manager (Debian's apt-get,
Mac OS X's brew, Red Hat's yum). CB makes use of three databases:
`candy_basket_test`, `candy_basket_development`, `candy_basket` (for
production). On the development machine onle the
candy_basket_development must be created in advanced. The tests will
create and destroy the `candy_basket_test` database automatically, in
fact, tests will fail if this database is already present.

In the development database sample data can be included in a number of
ways, either programmatically importing old candies or manually
entering some sample data using the running development
application. The views will have to be created manually at the moment.

In the test database sample data is automatically generated as part of
unit tests and the views are also programmatically created before
used. The code in unit tests to create the views also serve as
specifications of the design views and can simply be copy pasted in
the CouchDB admin web UI.


Development Work-flow
=====================

The CB project constantly strives to improve its development
operations in order to produce software of higher quality at a more
efficient rate. This part of the developer guide will constantly
evolved and should be kept close at hand when developing on the CB
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

However, never publish work to master. The following section describes
the procedures to develop on CB.

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

Any line of the commit message must not be longer 100 characters. This
allows the message to be easier to read on github as well as in
various git tools.

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

Do the pull request from github and use the last commit as the message.

Candy Basket Application
========================

Briefly, the Candy Basket application is composed of two main parts: a
computer consumable service on the backend (i.e. run on the server)
and a human consumable service on the frontend (i.e. runs in the
browser). The backend is a NodeJS powered RESTful service and the
frontend is an HTML, CSS and Javascript Web User Interface (UI)
capable of talking to the backend.

* README.rm -- TODO - A brief introduction and pointers
* LICENSE.md -- TODO - Add license
* CHANGELOG.md -- TODO - Add automatically generated change logs
* backend -- The NodeJS RESTful service
* frontend -- The AngularJS Web application
* docs -- The documentation for this project 

Dependencies
------------

Candy Basket has a number of dependencies but they can all easily be
installed from with the root of your own clone repository. The
production backend libraries and the development and test libraries
are typically always npm packages with the dependencies clearly
defines in a `packages.json` file, one in the backend and one in the
frontend directory. From the backend **and** then from the frontend you
can simply install server side dependencies like this::

  [user]$ npm install

Frontend dependencies, those that will run in the client browser
powering the web UI are installed using the Bower package management
tool. From within the frontend directory you can simply do::

  [user]$ bower install

Those command are idempotent and is does not matter how often you
execute them. Installing new dependencies for development can be done
with the same tool.

Backend dependencies and frontend development and test libraries::

  [user]$ npm install new-grunt-plugin new-backend-library

Frontend dependencies::

  [user]$ bower install new-angular-third-party-directive


Some of the packages may have additional lower level dependencies of
their own in which case you would typically have to install some
package on your OS such as xml headers from the development package.

.. _rest-service:
Backend -- The RESTful Service
------------------------------

The backend is written entirely in the Javascript programming language
implementing a simple RESTful service.


High Level Architecture
~~~~~~~~~~~~~~~~~~~~~~~

The Candy Basket backend is a RESTful service following a Resource
Oriented Architecture (ROA) as defined in [REST-SERV]_. The following
tables describe its service. Note that no API version number is
included in the URI; it will be included in the host as
`http://candy-restapi-v1.pacificpolicy.org.vu/
<http://candy-restapi-v1.pacificpolicy.org.vu/>`_.

*User Account Service*

Each organisation can have a number of users using the tool. However,
user management is usually done using an external service such as
Active Directory or another LDAP service like OpenLDAP. However, the
users are used in the candy basket service: every source "belongs" to a
user.

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

*Source (Candies) Service*

This is the main service of candy basket: users can add "source(s)"
and tag them. A source is typically a URL but eventually could be
other things such as a document, an hyperlink or an email. In the
technical world of Candy Basket (such as in the source code) sources
are typically referred to as candies; they are exactly the same
thing. In the UI the term source is used.

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


*Utilities Service*

Only a couple of utility aggregates are needed at the moment.

+-----------------------------------+-----------------------------------------+
| Operation                         | HTTP Method and URI                     |
+===================================+=========================================+
| Fetch all sources                 | GET /basket/candies                     |
+-----------------------------------+-----------------------------------------+
| Fetch all candies and their tags  | GET /basket/candies/tags-by-candies     |
+-----------------------------------+-----------------------------------------+

 
Implementation Details
~~~~~~~~~~~~~~~~~~~~~~

Express and some additional express middleware libraries are glued
together to implement the RESTful service described in rest-service_.

*Controllers*

The backend implementation is actually quite simple and most of the
work in done here, in controllers. There is a Express route defined
for each of the REST points detailed above. All those routes are
defined in `backend/app/controllers.js` and are implemented as
Javascript async functions. Interaction with the CouchDB persistent
store is done inside those functions.

Data validation is done inside a single Javascript function also in
`backend/app/controllers.js`. It does basic checks on all fields and
HTML sanitization before approving and sending to persist in CouchDB.

*Models*

The is currently no *models* as the primary data object travels in
JSON and also is persisted in JSON with no impedance mispatch between
code and data layer.  For this reason there is currently no model
layer and data is directly persisted from the controller layer. 

*Views* 

There is also no views and this is a backend API service only, views
 are handled in the frontend.

*Middleware*

In Express additional functionalities is often added through
middleware, small re-usable pieces of software can gets inserted
inside a request/response cycle. Functionalities such as CORS support,
error handling, logging, headers modification, data validation and
just about everything else that enriches a web application can be done
using middleware. The rule here is the same, when it is possible to
find acceptable solutions from the community this is the preferred
approach, otherwise we need to develop our own. Community contributed
middleware is typically installed through npm and configured following
their own respective documentation. Our own custom middleware is
currently in `backend/app/middlewares.js`.

Experimenting with API
~~~~~~~~~~~~~~~~~~~~~~

When developing it is often useful to use the RESTful API
directly. Here are some example usage.

Fetching all candies::

  [user]$ curl -X GET http://localhost:3003/basket/candies

Fetching a candy::

  [user]$ curl -X GET http://localhost:3003/basket/candies/03c0b670e5c56bfb461a76dcf7000d1c

Creating a candy::

  [user]$ curl -X POST \
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

Or an invalid JSON::

  {
    "source": "http://www.ghachey.info",
    "title": "Ghislain Website",
    "description": "<script>alert(\"Hacked onced, shame on you.\");</script>",
    "tags": [
      "Website",
      "Ghislain Hachey"
    ]
  }

Or creating a candy with an attachment (note that not the whole base64
encoded string is shown)::

  {
    "source": "http://www.ghachey.info",
    "title": "Ghislain Website",
    "description": "<script>alert(\"Hacked onced, shame on you.\");</script>",
    "tags": [
      "Website",
      "Ghislain Hachey"
    ],
    "attachment_filename": "file.json",
    "attachment" :"ewogICJzb3VyY2UiOiAiaHR0cDovL3d3dy5naGFjaGV5LmluZm8iLAogICJ0aXRsZSI6ICJHaGlzbGFpbiBIYWNoZXkgV2Vic2l0ZSIsCiAgImRlc2NyaXB0aW9uIjogIkEgYml0IHVwZGF0ZWQiLAogICJ0YWdzIjogWyJnaCIsImljdCIsIndlYnNpdGUiXQp9Cg=="
  }

where the attachment_filename field contains the filename and will be
used to reconstruct the file before uploading to the ownCloud server
which is base64 encoded in the attachment field.

Updating a candy::

  [user]$ curl -X PUT \
               -H "Accept: application/json"  \
               -H "Content-Type: application/json" \
               -d @candy-update.json \
               http://localhost:5000/basket/candies/id-of-candy-in-couchdb

Where id-of-candy-in-couchdb is the id automatically created on POST
and returned in the Location header for latter retrieval. It can be
retrieved in a number of ways. Looking at data in the DB is fairly
easy and quick. The newly updated candy could look like this::

  {
    "source": "http://www.ghachey.info",
    "title": "Ghislain Hachey Website",
    "description": "A bit updated--oups, I meant a bit outdated",
    "tags": ["gh","ict","website"]
  }


Frontend -- Web UI Application
------------------------------

The Frontend is developed using the AngularJS web
framework with community Angular modules and our own code.

High Level Architecture
~~~~~~~~~~~~~~~~~~~~~~~

The frontend code based is organised following Angular community best
practices.

* `frontend/app/scripts/app.js`: this is where the application is bootstrapped. It contains
  some configuration and some routes definitions.
* `frontend/app/services/`: this directory contains application services.
* controllers/: this is where the business logic resides; no DOM manipulation should happen here.
* `frontend/app/scripts/filters/`: this where filters are stored often used has a final
  filtering step before presenting the data (e.g. money and date
  conversions formatters). It can also include data filtering code. 
* `frontend/app/scripts/directives/`: this is where you can manipulate the DOM as you
  wish. Think of directives as a means to extend HTML and browser
  capabilities for web *applications*.
* `frontend/app/index.html`: is the base HTML file for the whole
  application
* `frontend/app/views/`: contains all the other HTML partials that
  make up the rest of the application.
* `frontend/app/styles/`: contains custom styles
* `frontend/app/images/`: contains images
* `frontend/test/specs/`: where unit tests resides. Directories in there
  mirrors the content of the `frontend/app/scripts/`

Implementation Details
~~~~~~~~~~~~~~~~~~~~~~

TODO

Documentation
-------------

Documentation is prepared using an excellent tool developed in the
Python world called Sphinx `http://sphinx-doc.org
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