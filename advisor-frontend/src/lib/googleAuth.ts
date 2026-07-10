import supabase from './supabase';

export async function signInWithGoogle(appName: string = 'Aura') {
  if (!supabase) {
    console.warn('[google-auth] Supabase not configured');
    return;
  }
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/dashboard'
    }
  });

  if (error) {
    console.error('[google-auth] signInWithOAuth failed:', error.message);
  }
}

export async function handleGoogleRedirect() {
  const params = new URLSearchParams(window.location.search);
  const errorDescription = params.get('error_description');
  if (errorDescription) {
    console.error('[google-auth] Auth error from redirect:', errorDescription);
  }
}
