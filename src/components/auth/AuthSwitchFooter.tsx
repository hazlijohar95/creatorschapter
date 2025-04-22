
type AuthSwitchFooterProps = {
  isSignUp: boolean;
  onToggle: () => void;
};

export default function AuthSwitchFooter({ isSignUp, onToggle }: AuthSwitchFooterProps) {
  return (
    <p className="text-sm text-center font-manrope mt-7">
      {isSignUp ? "Already have an account? " : "Don't have an account? "}
      <button
        type="button"
        onClick={onToggle}
        className="text-primary underline underline-offset-2 hover:text-neon font-medium transition"
      >
        {isSignUp ? "Sign in" : "Create one"}
      </button>
    </p>
  );
}
