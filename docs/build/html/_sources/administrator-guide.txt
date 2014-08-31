===================
Administrator Guide
===================

Introduction
============

**Note: Mnemoniq is referred herein as Candy Basket and memories and
candies for historical reasons. This will eventually be changed, but
for now the technical terminologies used are the old ones.**

This guide is meant for the person who wants to deploy Candy Basket in
its own environment. Candy Basket supports single signon for
authentication, and once authenticated users have full access to the
application. Candy Basket was tested to work with both Windows Server
2008 and Samba 4 as Active Directory and Domain Controller. 

Candy Basket can be deployed on essentially any operating system using
any HTTP server. However, the only tested and supported approach is
deploying Candy Basket on the latest Debian 7 with Apache and WSGI.

Pre-Built VMWare Image 
======================

The supported way of deploying Candy Basket is the pre-built VMWare
image. This image comes ready to be deployed to your VMware
infrastructure with minimal configuration. 

The installation of the image should be a simple matter of booting it
from your VMware host server. However, you will need to correctly
setup networking, preferably in bridge mode where it will live
side-by-side with the rest of the network. You will need to assign it
a static IP address. 

It is assumed you run your own internal DNS. You will need to add your
chosen fully qualified host name as an A record to this new server,
for example::

  192.168.1.10     A      candy.pacificpolicy.org

Reverse DNS must also be working for single sign-on to work. Once the
new server is part of your network and you can correctly ping it using
its host name you will need to change the domain name in several
places.

* All three Apache Virtual Hosts configuration in
  `/etc/apache2/sites-available/`
* The CORS Python file in
  `/srv/www-apps/candybasket/backend/config.py`. The allowed domains
  should be identified there. This should a single fully qualified
  host name such as `candy.pacificpolicy.org`.
* The Candy Basket RESTful service location in
  `/srv/www-apps/candybasket/frontend/static/js/services.js`. The
  variable `wsUrl` should be changed to your own fully qualified host
  name.

Restart Apache, tail -f its `/var/log/error.log` file and try
pointing your browser to `https://candy.pacificpolicy.org`.

VMWare Test Environment
=======================

If you are interested in improving the VMWare image or anything in the
build process these notes might come in handy to create your own test
environment. We use VMware workstation with a number of VMware Virtual
Machines (VM) to simulate a production environment. On my machines I
create the following VMs:

* **debian.pacificpolicy.org** the machine running the Candy Basket
    application deployed as detailed in deploy-debian-apache_
* **winserver2008.pacificpolicy.org** An Active Directory and Domain
    Controller running Windows Server 2008
* **samba4.pacificpolicy.org** An Active Directory and Domain
    Controller running Samba4 on Debian
* **win7.pacificpolicy.org** A Windows 7 workstion

VMWare Vitual Machines Lab Setup
--------------------------------

* Install VMware workstation
* Create a number of vitual machines: one Windows Server 2008
  (winserver2008.pacificpolicy.org), one Windows 7 Pro
  (win7.pacificpolicy.org), one Windows 8 Pro
  (win8.pacificpolicy.org), one Debian Linux to host software
  application (server.pacificpolicy.org).
* Create a private LAN Segment. This can be done in any VM's LAN
  settings.
* Configure the Windows server 2008 VM with two virtual network
  interfaces: one will NAT from the host and the other should be part
  of a the private LAN segment.
* Configure the VMs that will be part of the domain (Win7, Win8 and
  Debian Linux) with the private LAN segment for networking.

Windows Server 2008 Configuration
---------------------------------

Open the Server Manager and add and configure necessary roles including:

* Active Directory Domain Services steps.
* DHCP Server (e.g. assign a pool of 192.168.30.100-200 on the Windows
  server internal network interfaces with static IP of 192.168.30.1)
* DNS Server (e.g. create A records for all machines in the test lab:
  win7.pacificpolicy.org, debian.pacificpolicy.org,
  winserver2008.pacificpolicy.org and add CNAME records for services
  on the debian server, something like CNAME www.pacificpolicy.org ->
  debian.pacificpolicy.org)
* Network Policy and Access Services (to turn it into a Gateway
  (Route/NAT)) step.

If you want to access private VMs using SSH from your host you could
port forward traffic through the Windows Server with the following
commands::

  C:\> netsh interface portproxy add v4tov4 listenport=2222 listenaddress=172.16.228.136 connectport=22 connectaddress=192.168.20.10

Join Domain with Windows VMs
----------------------------

Boot the VMs and verify that networking is working correctly. Make
sure IP addresses are assigned according to the DHCP pool configure in
the previous step. Test DNS with nslookup or simple ping::

  [root]$ nslookup winserver2008.pacificpolicy.org
  [root]$ nslookup win7.pacificpolicy.org
  [root]$ nslookup server.pacificpolicy.org

If the Windows Server was correctly setup as a gateway in "Network
Policy and Access Services" access to the Internet should work. Verify
that the time is correctly being synced with Internet servers. You
should now be able to join the domain.

Join Domain with the Linux Server VM
------------------------------------

The Linux server can make use of a static IP address. The appropriate
A record should be added to the Windows Server 2008 DNS zone
file. Test networking (DNS and Internet access) and join the domain as
a samba client.

Regarding Linux Guest VMs, VMWare specifically recommends to use NTP
on the guest instead of the VMware's time syncing feature (see
here). Since time sync is critical for the proper functioning of the
single signon authentication it is better to be safe and follow best
practices.  Installing ntp on Debian is easy::

  [root]$ aptitude install ntp

The default values in /etc/ntp.conf are fine, but it is recommended by
VMware to add the following line to make sure ntp always syncs
regarless of any large time jump it observes between Internet NTP
servers and local OS time::

  tinker panic 0

then restart ntp::

  [root]$ service ntp restart

You might find it useful to allow yourself to SSH inside the Debian
VMware from your host terminal; otherwise, getting in and out of the
VM's terminal is annoying and you loose the ability to copy/paste from
host to VM. Apparently setting up port forwarding on Windows Server
2008 R2 through the GUI is cmpletely broken. I have not tested this
myself, but it is easy to do on the command line as detailed here.

.. _deploy-debian-apache:
Deployment on Debian with Apache HTTP server
============================================

The steps to deploy Candy Basket on a production Debian server are
very similar to setting up Candy Basket in a development environment.

Oerating System
---------------

Download an ISO of the latest Debian and do a bare installation with
only the standard utilities and SSH. You may also install any other
useful packages you will most likely eventually need such as rsync,
ntp, curl, wget. ::

  [root]$ aptitude install rsync ntp sudo curl wget vim locate screen zip git

Create a user to 'own' the Candy Basket application ::

  [root]$ adduser candy

Dependencies
------------

Install the Apache HTTP server with Python support. ::

  [root]$ aptitude install apache2 libapache2-mod-wsgi python-dev

Install Python and preferably virtualenv to cleanly isolate the
application and its dependencies. This process is exactly as defined
in python-and-virtualenv_. The only difference in production
will be the creation of an BASELINE virtual environment for Apache:
this is an empty virtual environment with its own clean Python
installation meant to power Python web applications. The BASELINE
virtual environment could be owned by any user but in this case we
will make use of the `candy` user.

Create the BASELINE. ::

  [candy]$ mkvirtualenv BASELINE

And finally, tell Apache about it by adding the following line in
`/etc/apache2/conf.d/wsgi.conf`. ::

  WSGIPythonHome  /home/candy/.virtualenvs/BASELINE

At this point, you should have two virgin virtual environments, test
it before going further. ::

  [candy]$ lsvirtualenv 
  BASELINE
  ========

  candy.pacificpolicy.org
  =======================

Install CouchDB in a similar way as you would in a development
environment. In production, CouchDB can also be owned by `candy`
instead of `root`. The new Linux Filesystem Hierarchy Standard [FHS]_
recommends installing such "non-distro provided" or optional software
in `/opt/`. As user `root`, make a nice place for it. ::

  [root]$ mkdir /opt/candy/
  [root]$ chown candy:candy -R /opt/candy/

As user `candy`, install CouchDB as detailed in
couchdb_. Couchdb dependencies will have to be installed as
`root`, of course. In production it would be a good idea to have an
init script. On Debian you can simply edit the distribution provided
`/etc/init.d/skeleton`. Test you correctly created the init script::

  [root]$ /etc/init.d/couchdb start
  [root]$ ps -ef | grep couch
  (couchdb processes running)
  [root]$ /etc/init.d/couchdb stop
  [root]$ ps -ef | grep couch
  (no couchdb process output)
  [root]$ /etc/init.d/couchdb restart

Once the init script is working you can instruct the system to start
it on boot::

  [root]$ update-rc.d couchdb default

You should not be able to login CouchDB by pointing your browser to
`http://localhost:5984/_utils` or `http://ip.address:5984/_utils` if
you are connecting from a remote machine although by default CouchDB
listens on localhost so this would involved changing the
configuration.  From the administrative interface create a database
with the name `candybasketng` and add the design documents
(i.e. views) located in `db/views/docs/`.
 
Candy Basket as Apache Virtual Host
-----------------------------------

The final step to deploy the Candy Basket application. Create a
directory where the application will be served from::

  [root]$ mkdir -p /srv/www-apps/candybasket/

More work will be done to improve the development to production
workflow cycle but for now simply `rsync` the whole source tree into
`/srv/www-apps/candy.pacificpolicy.org/`. Let's assume you have the
latest source checked out in `/home/candy/`::

  [root]$ rsync -avg /home/candy/tagging-tool/ /srv/www-apps/candybasket/
  [root]$ chown candy:www-data -R /srv/www-apps/candybasket/

Create three Apache virtual hosts: one for the Candy Basket REST
service and two for the Candy Basket application (HTTP and
HTTPS). Sample configuration are included below. 

*candybasket.http*::

  <VirtualHost *:80>
          ServerName candy.pacificpolicy.org
          ServerAlias candy candy.pacificpolicy.org.vu
          ServerAdmin admin@localhost

          RewriteEngine on
          ReWriteCond %{SERVER_PORT} !^443$
          RewriteRule ^/(.*) https://%{HTTP_HOST}/$1 [NC,R,L]

          ErrorLog ${APACHE_LOG_DIR}/error.log
          LogLevel warn
          CustomLog ${APACHE_LOG_DIR}/access.log combined
  </VirtualHost>

*candybasket.https*::

  <IfModule mod_ssl.c>
  <VirtualHost *:443>
          ServerName candy.pacificpolicy.org.vu
          ServerAlias candy candy.pacificpolicy.org
          ServerAdmin admin@localhost

          DocumentRoot /srv/www-apps/candybasket/frontend/

          <Directory /srv/www-apps/candybasket/frontend/>
                  Order allow,deny
                  Allow from all
          </Directory>

          Alias /help /srv/www-apps/candybasket/docs/build/html/

          ProxyPass /basket http://candy-restapi-v1.pacificpolicy.org.vu/basket
	  ProxyPassReverse /basket http://candy-restapi-v1.pacificpolicy.org.vu/basket

          ErrorLog ${APACHE_LOG_DIR}/error.log
          LogLevel warn
          CustomLog ${APACHE_LOG_DIR}/ssl_access.log combined

          SSLEngine on
          SSLCertificateFile    /etc/ssl/certs/ssl-cert-snakeoil.pem
          SSLCertificateKeyFile /etc/ssl/private/ssl-cert-snakeoil.key

          <FilesMatch "\.(cgi|shtml|phtml|php)$">
                  SSLOptions +StdEnvVars
          </FilesMatch>

          <Directory /usr/lib/cgi-bin>
                  SSLOptions +StdEnvVars
          </Directory>

          BrowserMatch "MSIE [2-6]" \
                  nokeepalive ssl-unclean-shutdown \
                  downgrade-1.0 force-response-1.0
          # MSIE 7 and newer should be able to use keepalive
          BrowserMatch "MSIE [17-9]" ssl-unclean-shutdown
  </VirtualHost>
  </IfModule>

*candybasket-restapi-v1*::

  <VirtualHost *:80>
          ServerName candy-restapi-v1.pacificpolicy.org
          ServerAlias candy-restapi-v1 candy-restapi-v1.pacificpolicy.org.vu
          ServerAdmin admin@localhost

          WSGIDaemonProcess runservice user=www-data group=www-data processes=1 threads=5
          WSGIScriptAlias / /srv/www-apps/candybasket/backend/runservice.wsgi

          <Directory /srv/www-apps/candybasket/backend/>
  #               Header set Access-Control-Allow-Origin "*"
  #               Header set Access-Control-Allow-Credentials true
                  WSGIProcessGroup runservice
                  WSGIApplicationGroup %{GLOBAL}
                  WSGIScriptReloading On
                  Order deny,allow
                  Allow from all
          </Directory>

          ErrorLog ${APACHE_LOG_DIR}/error.log
          LogLevel warn
          CustomLog ${APACHE_LOG_DIR}/access.log combined
  </VirtualHost>

Enable the needed modules and the new virtual hosts and then restart Apache::

  [root]$ a2ensite candybasket.http
  [root]$ a2ensite candybasket.https
  [root]$ a2ensite candybasket-restapi-v1
  [root]$ a2enmod ssl
  [root]$ a2enmod rewrite
  [root]$ a2enmod proxy
  [root]$ a2enmod proxy_http

  [root]$ service apache2 restart

Make sure name resolution is working for the domains used in the
Apache Virtual Hosts. If you you do not have internal DNS adding the
records in the servers' `/etc/hosts` file will work::

  127.0.0.1       candy.pacificpolicy.org
  127.0.0.1       candy-restapi-v1.pacificpolicy.org
  127.0.0.1       candy.pacificpolicy.org.vu
  127.0.0.1       candy-restapi-v1.pacificpolicy.org.vu

Connect to the `candy` virtualenv and install Candy Basket's Python
dependencies::

  [candy]$ workon candy.pacificpolicy.org
  (candy.pacificpolicy.org)[candy]$ cd /srv/www-apps/candybasket/backend/
  (candy.pacificpolicy.org)[candy]$ pip install -r requirements.pip

As a final step to make sure that all the bits connect together the
WSGI script `/srv/www-apps/candybasket/backend/runservice.wsgi` should
be verified. It is mostly also preconfigured except that the following
two lines will depend on your own environment: what did you call the
Python virtualenv (it's `candy` here) and what Python version is
running on your OS. If steps herein were closely followed the
following two lines should be edited and uncommented to look like::

  # If using virtualenv, add the virtualenv's site-packages to sys.path as well
  VENV_PATH = "/home/candy/.virtualenvs/candy.pacificpolicy.org/"
  site.addsitedir(os.path.join(VENV_PATH,'lib/python2.7/site-packages/'))

Restart Apache, tail -f its `/var/log/error.log` file and try pointing
your browser to `https://candy.pacificpolicy.org`. At this point you
should have a fully working albeit insecured installation of Candy
Basket.

Windows Active Directory and Apache Kerberos Single Sign-on 
===========================================================

Candy Basket can be securely deployed in a Windows environment with
users authenticating to it using single signon (SOO). In other words,
members of the domain that are logged in the network should be able to
access the web application securely without providing credentials.

Install Necessary Software
--------------------------

Some kerberos, Apache and samba packages are needed::

 [root]$ aptitude install apache2-mpm-prefork libapache2-mod-auth-kerb 
 [root]$ aptitude install krb5-config krb5-user krb5-clients samba-client ntp

Time Synchronization
--------------------

This setup is high sensitive to clocks being in sync. The network time
protocol is the best approach to make things work::

 [root]$ aptitude install ntp

The default values in `/etc/ntp.conf` are fine. However, ntp will stop
syncing if it detects a large enough jump in time as it assumes you
are getting time from an invalid source.  Syncing using the provided
default OS' ntp servers should be safe. If you are on VMware or
anywhere the time may drift easily it would be a good idea to always
sync regarless of any large time jump; it can be achieved by adding
the following line at the top of `/etc/ntp.conf`::

  tinker panic 0

then restart ntp::

  [root]$ service ntp restart

DNS Configuration
-----------------

The setup here as three machines: a Windows Server 2008 RC2 with
Active Directory and Domain Controller, a Debian werver running the
web service and a Windows 7 workstation. Forward and reverse DNS
should be configured something like this::

  winserver2008.pacificpolicy.org    A    192.168.30.1
  debian.pacificpolicy.org    A    192.168.30.10
  www.pacificpolicy.org    CNAME    debian.pacificpolicy.org
  test.pacificpolicy.org    CNAME    debian.pacificpolicy.org

Make sure everything resolves as it should from within
win7.pacificpolicy.org::

  [root]$ nslookup debian.pacificpolicy.org
  Server:        192.168.30.1
  Address:    192.168.30.1#53
  Name:    debian.pacificpolicy.org
  Address: 192.168.30.10

  [root]$ nslookup www.pacificpolicy.org
  Server:        192.168.30.1
  Address:    192.168.30.1#53
  www.pacificpolicy.org    canonical name = debian.pacificpolicy.org.
  Name:    www.pacificpolicy.org
  Address: 192.168.30.10

  [root]$ nslookup 192.168.30.10
  Server:        192.168.30.1
  Address:    192.168.30.1#53
  10.30.168.192.in-addr.arpa    name = debian.pacificpolicy.org.

Kerberos configuration
----------------------

Back on the Debian server, backup the original and create your own::

  [root]$ sudo cp /etc/krb5.conf /etc/krb5.conf.bak

  [libdefaults]
          default_realm = PACIFICPOLICY.ORG
          # The following krb5.conf variables are only for MIT Kerberos.
          krb4_config = /etc/krb.conf
          krb4_realms = /etc/krb.realms
          kdc_timesync = 1
          ccache_type = 4
          forwardable = true
          proxiable = true

  [realms]
          PACIFICPOLICY.ORG = {
                  kdc = winserver2008.pacificpolicy.org
                  master_kdc = winserver2008.pacificpolicy.org
                  admin_server = winserver2008.pacificpolicy.org
                  default_domain = pacificpolicy.org
          }

  [domain_realm]
          .pacificpolicy.org = PACIFICPOLICY.ORG
          pacificpolicy.org = PACIFICPOLICY.ORG

  [login]
          krb4_convert = true
          krb4_get_tickets = false

Test Kerberos by getting a ticket-granting ticket (TGT) for the domain
controller's Administrator user::

  [root]$ kinit Administrator
  Password for Administrator@PACIFICPOLICY.ORG: 
  [root]$ klist
  Ticket cache: FILE:/tmp/krb5cc_0
  Default principal: Administrator@PACIFICPOLICY.ORG

  Valid starting    Expires           Service principal
  24/10/2013 15:13  25/10/2013 01:13  krbtgt/PACIFICPOLICY.ORG@PACIFICPOLICY.ORG
      renew until 25/10/2013 15:13

Configure Samba to Join the Domain
----------------------------------

Backup the original configuration and use the minimal configuration below::

  [root]$ cp /etc/samba/smb.conf /etc/samba/smb.conf.bak

  [global]
          netbios name = debian
          realm = PACIFICPOLICY.ORG
          workgroup = PACIFICPOLICY
          server string = %h server
          dns proxy = no
          log file = /var/log/samba/log.%m
          max log size = 1000
          panic action = /usr/share/samba/panic-action %d
          security = ADS
          password server = winserver2008.pacificpolicy.org
          encrypt passwords = true
          passdb backend = tdbsam
          obey pam restrictions = yes
          unix password sync = yes
          passwd program = /usr/bin/passwd %u
          passwd chat = *Enter\snew\s*\spassword:* %n\n *Retype\snew\s*\spassword:* %n\n *password\supdated\ssuccessfully* .
          pam password change = yes
          map to guest = bad user
          kerberos method = dedicated keytab

Join the domain
---------------

The server should be a member of the domain; this is easy with Samba::

  [root]$ net ads join -U Administrator
  Enter Administrator's password:
  Using short pacificpolicy.org -- PACIFICPOLICY
  Joined 'SERVER' to realm 'pacificpolicy.org'

If the domain is joined successfully a new Active Directory account
will be created. That machine account could be used but I opted to
create a specific user to handle authentication of the service. On the
windows server add a new AD user account (e.g. I add a user HTTP
Service with user httpservice) and make sure the password can not be
reset and will last foreever.

Now you need to create the 'principle': someone or something to
authenticate or authenticate to (e.g. users, services). This can be a
little tricky and there are a few ways to achieve this. Use the kpass
utility to create the keytab with the principal; it will both add the
service principal to the user and create a keytab which can later be
used by a service such as Apache::

  C:\> ktpass -princ HTTP/debian.pacificpolicy.org@PACIFICPOLICY.ORG 
  -mapuser httpservice@PACIFICPOLICY.ORG 
  -crypto RC4-HMAC-NT 
  -ptype KRB5_NT_PRINCIPAL 
  -pass somepassword 
  -out c:\Temp\krb5.keytab

Copy the file `c:\\Temp\\krb5.keytab` on the Debian server somewhere
appropriate (e.g. `/etc/krb5.keytab`). Assign correct ownership and
permissions::

  [root]$ chown root.www-data /etc/krb5.keytab
  [root]$ chmod 0640 /etc/krb5.keytab

This should be it, but some testing will help. Get a Ticket-Granting
Ticket (TGT) for the service principal::

  [root]$ kinit HTTP/debian.pacificpolicy.org@PACIFICPOLICY.ORG

View the ticket from the cache::

  [root]$ klist
  Ticket cache: FILE:/tmp/krb5cc_0
  Default principal: HTTP/debian.pacificpolicy.org@PACIFICPOLICY.ORG

  Valid starting    Expires           Service principal
  30/10/2013 16:20  31/10/2013 02:20  krbtgt/PACIFICPOLICY.ORG@PACIFICPOLICY.ORG
      renew until 31/10/2013 16:20

Get a service ticket for the principal::

  [root]$ kvno HTTP/debian.pacificpolicy.org@PACIFICPOLICY.ORG
  HTTP/debian.pacificpolicy.org@PACIFICPOLICY.ORG: kvno = 4

List what is in the ticket cache and make sure you show the encryption
type usig the '-e' flag::

  [root]$ klist -e
  Ticket cache: FILE:/tmp/krb5cc_0
  Default principal: HTTP/debian.pacificpolicy.org@PACIFICPOLICY.ORG

  Valid starting    Expires           Service principal
  30/10/2013 16:20  31/10/2013 02:20  krbtgt/PACIFICPOLICY.ORG@PACIFICPOLICY.ORG
      renew until 31/10/2013 16:20, Etype (skey, tkt): aes256-cts-hmac-sha1-96, aes256-cts-hmac-sha1-96 
  30/10/2013 16:22  31/10/2013 02:20  HTTP/debian.pacificpolicy.org@PACIFICPOLICY.ORG
      renew until 31/10/2013 16:20, Etype (skey, tkt): arcfour-hmac, arcfour-hmac

Compare the service principal ticket above with the one from the
keytab file which will be used by Apache::

  [root]$ klist -e -k -t /etc/krb5.keytab 
  Keytab name: FILE:/etc/krb5.keytab
  KVNO Timestamp        Principal
  ---- ---------------- ---------------------------------------------------------
     4 01/01/1970 11:00 HTTP/debian.pacificpolicy.org@PACIFICPOLICY.ORG (arcfour-hmac)

The KVNO (password version number) , the encryption type and the
service principal name (i.e. HTTP/debian.pacificpolicy.org@PACIFICPOLICY.ORG) must
all match.  Apache VirtualHost Configuration

Add appropriate lines in the virtualhost to enable kerberos
authentication::
  
  <VirtualHost *:80>
          ServerAdmin webmaster@localhost
          ServerName test.pacificpolicy.org
  
          DocumentRoot /srv/www-apps/test-single-signon
  
          <Directory /srv/www-apps/test-single-signon>
                  Options Indexes FollowSymLinks MultiViews
                  AllowOverride None
                  Order allow,deny
                  allow from all
  
                  # Kerberos Single Signon
                  AuthType Kerberos
                  AuthName "Kerberos Login"
                  KrbAuthRealms PACIFICPOLICY.ORG
                  KrbServiceName HTTP
                  KrbMethodNegotiate On
                  KrbMethodK5Passwd On
                  Krb5KeyTab /etc/krb5.keytab
                  Require valid-user
  
          </Directory>
  
          ErrorLog ${APACHE_LOG_DIR}/error.log
  
          # Possible values include: debug, info, notice, warn, error, crit,
          # alert, emerg.
          LogLevel debug
  
          CustomLog ${APACHE_LOG_DIR}/access.log combined
  </VirtualHost>

Test from Client Workstations
-----------------------------

Try login from a workstation that is joined to the domain and logged
in with a user; you should automatically be authenticated. You migvht
have to indicate to the Internet Explorer that the site you are
accessing is part of the Intranet. For example, add
`http://*.pacificpolicy.org` to Internet `Options->Security->Intranet->Sites`.

Try with another workstion not joined to the domain; you should be
prompt to enter credentials.
