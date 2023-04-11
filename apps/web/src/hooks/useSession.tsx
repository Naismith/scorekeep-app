import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { createGlobalState } from "react-use";
import { supabase } from "../supabaseClient";

const useInternalSession = createGlobalState<Session | null>(null);
const useSessionLoading = createGlobalState(true);

export const useSession = () => {
  const [session] = useInternalSession();
  const [loading] = useSessionLoading();

  return {
    session,
    loading,
  };
};

export const useLogout = () => {
  return supabase.auth.signOut;
};

export const useGlobalSessionEffect = () => {
  const [session, setSession] = useInternalSession();
  const [, setLoading] = useSessionLoading();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return session;
};
