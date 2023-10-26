export const SESSION_KEY = "sessionAuth";

export const saveSession = (session) => {
   try {
      window.session = session;

      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
   } catch (error) {
      console.log(error);
      window.session = null;
   }
};

export const loadSession = () => {
   try {
      const session = JSON.parse(localStorage.getItem(SESSION_KEY));
      if (session) {
         window.session = session;
      } else {
         window.session = null;
      }
   } catch (error) {
      console.log(error);
      window.session = null;
   }
};

export const getTokenSession = () => {
   try {
      const session = getSession();
      return session ? session.token : null;
   } catch (error) {
      console.log(error);
      return null;
   }
};

export const getSession = () => {
   try {
      const session = JSON.parse(localStorage.getItem(SESSION_KEY)) || null;
      return session ? session : null;
   } catch (error) {
      console.log(error);
      return null;
   }
};

export const removeSession = () => {
   try {
      return localStorage.removeItem(SESSION_KEY);
   } catch (error) {
      console.log(error);
      return null;
   }
};
