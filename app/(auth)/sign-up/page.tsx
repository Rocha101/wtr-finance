const SignUpPage = () => {
  return (
    <div>
      <h1>Sign Up</h1>
      <button onClick={() => alert("You have signed in!")}>Sign In</button>
      <p>
        Already have an account? <a href="/sign-in">Sign in</a>
      </p>
    </div>
  );
};

export default SignUpPage;
