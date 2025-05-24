from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from models import Profile


SLACK_PROFILE_BASE_URL = "https://harriscapp.slack.com/team/"


class SlackSocialAccountAdapter(DefaultSocialAccountAdapter):
    """
    This class overrides the default behavior to allow us to extract data from
    the extra_data field that Slack gives us and put it into the correct place
    """

    def populate_user(self, request, sociallogin, data):
        # This overrides how django all auth populates auth_user
        user = super().populate_user(request, sociallogin, data)
        extra = sociallogin.account.extra_data

        user.first_name = extra.get("given_name", "")
        user.last_name = extra.get("family_name", "")
        user.email = extra.get("email", "")

        return user

    def save_user(self, request, sociallogin, form=None):
        # This overrides saving user data into ccserver_profile
        user = super().save_user(request, sociallogin, form)
        extra = sociallogin.account.extra_data

        # Create or get associated Profile
        # The downside of this approach
        profile, _ = Profile.objects.get_or_create(user=user)

        profile.photo_url = extra.get("picture", "")
        profile.slack_username = extra.get("name", "")
        profile.email = extra.get("email", "")

        slack_user_id = extra.get("https://slack.com/user_id", "")
        profile.slack_dm_url = (
            f"{SLACK_PROFILE_BASE_URL}{slack_user_id}" if slack_user_id else ""
        )

        profile.save()
        return user
