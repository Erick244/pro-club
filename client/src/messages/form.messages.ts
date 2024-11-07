const getMinMessage = (field: string, min: number) =>
    `${field} must contain at least ${min} character(s)`;

const getMaxMessage = (field: string, max: number) =>
    `${field} must contain at most ${max} character(s)`;

const SignUpForm = {
    name: {
        min: getMinMessage("Name", 2),
        max: getMaxMessage("Name", 50),
    },
    email: "Invalid e-mail address",
    password: {
        min: getMinMessage("Password", 8),
        max: getMaxMessage("Password", 16),
    },
    confirmPassword: "Passwords do not match.",
};

const SignInForm = {
    email: SignUpForm.email,
    password: SignUpForm.password,
};

const getRequiredMessage = (field: string) => `Please select a ${field}.`;

const SignUpDetailsForm = {
    country: getRequiredMessage("Country"),
    biography: {
        max: getMaxMessage("Biography", 255),
    },
};

const EmailConfirmationForm = {
    code: "Your code confirmation must be 6 characters.",
};

const EmailUpdateForm = {
    email: SignUpForm.email,
};

const ProfileForm = {
    profileImage: getRequiredMessage("Profile Image"),
    socialMedias: "Add at least one social media.",
};

const SocialMediaForm = {
    profileLink: {
        url: "Enter a valid URL",
    },
};

const ProfileGamesForm = {
    games: "Please select at least one game.",
};

export const formMessages = {
    EmailConfirmationForm,
    EmailUpdateForm,
    ProfileForm,
    ProfileGamesForm,
    SignInForm,
    SignUpDetailsForm,
    SignUpForm,
    SocialMediaForm,
};
