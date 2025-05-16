
#### Explanations of code for settings.py so we do not forget:

for **INSTALLED_APPS**: https://docs.djangoproject.com/en/1.8/intro/tutorial01/
Defaults and their meanings:
Also, note the INSTALLED_APPS setting at the top of the file. That holds the names of all Django applications that are activated in this Django instance. Apps can be used in multiple projects, and you can package and distribute them for use by others in their projects.

By default, INSTALLED_APPS contains the following apps, all of which come with Django:

django.contrib.admin – The admin site. You’ll use it in part 2 of this tutorial.
django.contrib.auth – An authentication system.
django.contrib.contenttypes – A framework for content types.
django.contrib.sessions – A session framework.
django.contrib.messages – A messaging framework.
django.contrib.staticfiles – A framework for managing static files.
These applications are included by default as a convenience for the common case.

Some of these applications make use of at least one database table, though, so we need to create the tables in the database before we can use them.

**Note for KJ: When you link the json data output you get upon successful auth you might need to come back here ^**


**for MIDDLEWARE**: Django, middleware is a framework that provides a method to process requests and responses globally before they are processed by the view or after they leave the view. Middleware components are designed so that they remain between the web server and the view, allowing us to perform various operations on requests and responses as they pass through the Django application and web browser.

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware", #
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
] #https://www.geeksforgeeks.org/middleware-in-django-image-video-error/

**for TEMPLATE**:
Being a web framework, Django needs a convenient way to generate HTML dynamically. The most common approach relies on templates. A template contains the static parts of the desired HTML output as well as some special syntax describing how dynamic content will be inserted.
Source: https://docs.djangoproject.com/en/5.2/topics/templates/
We used a default back end template: https://docs.djangoproject.com/en/5.2/ref/settings/#std-setting-TEMPLATES-BACKEND

**For

# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/

# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field
