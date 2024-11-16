  //apps/tma/src/components/initMiniApp.tsx

  import { useIntegration } from "@tma.js/react-router-integration";
  import {
    bindMiniAppCSSVars,
    bindThemeParamsCSSVars,
    bindViewportCSSVars,
    initNavigator,
    useMiniApp,
    //useCloudStorage,
    useThemeParams,
    useViewport,
  } from "@tma.js/sdk-react";
  import {useEffect, useMemo} from "react";
  import { Navigate, Route, Router, Routes } from "react-router-dom";
  import { routes } from "@/navigation/routes.tsx";
  import { Layout } from "./Layout";
  import { Settings } from "@/navigation/LazyComponents";
  //import { InitState } from "@/store/types";
  import { useCommonStore } from "./StoreContext";
  import { Music } from "./Music";
  import InvitePage from '@/pages/Community/Invite';
  import ReferralConfirm from '@/pages/Community/ReferralConfirm';

  const InitMiniApp = () => {
    const miniApp = useMiniApp();
    const themeParams = useThemeParams();
    const viewport = useViewport();


    useEffect(() => {
      return bindMiniAppCSSVars(miniApp, themeParams);
    }, [miniApp, themeParams]);

    useEffect(() => {
      return bindThemeParamsCSSVars(themeParams);
    }, [themeParams]);

    useEffect(() => {
      return viewport && bindViewportCSSVars(viewport);
    }, [viewport]);

    return <Routing />;
  };

  /*function isInitState(value: string): value is InitState {
    return value === "init" || value === "langSetted" || value === "done" || value === "referral" || value === "referralParent";
  }*/

  const Routing = () => {
    const navigator = useMemo(() => initNavigator("app-navigation-state"), []);
    const [location, reactNavigator] = useIntegration(navigator);
    const initState = useCommonStore((state) => state.initState);
    const setAppState = useCommonStore((state) => state.setAppState);
    //const cloudStorage = useCloudStorage();

    const newReferrals = useCommonStore((state) => state.newReferrals);
    const userInitialized = useCommonStore((state) => state.userInitialized);
    const isNewUser = useCommonStore((state) => state.isNewUser);
    //const referralCode = useCommonStore((state) => state.referralCode);

    console.log("isNewUser : ", isNewUser);

    console.log("Retrieved initApp from initMiniApp in the start of file:", initState);


    useEffect(() => {
      console.log("Retrieved initApp from initMiniApp:", initState);

      if (initState === 'loading' && userInitialized) {
        if (isNewUser) {
          setAppState({ initState: 'init', isNewUser: false });
        } else {
          setAppState({ initState: 'done' });
        }
      }

      if (initState === "done" && newReferrals.length > 0) {
        setAppState({ initState: "referralParent" });
      }

    }, [initState, setAppState, isNewUser, newReferrals.length, userInitialized]);

    useEffect(() => {
      navigator.attach();
      return () => navigator.detach();
    }, [navigator]);

    return (
      <>
        <Music />
        <Router location={location} navigator={reactNavigator}>
          <Routes>
            {initState === "referral" ? (
              <Route path="/" element={<Navigate to="/invite" replace />} />
            ) : initState === "init" ? (
              <Route path="/" element={<Navigate to="/settings" replace />} />
            ) : initState === "referralParent" ? (
                <Route path="/" element={<Navigate to="/ReferralConfirm" replace />} />
            ) : null}
            {initState !== "loading" ? (
              <Route path="/" element={<Layout />}>
                {routes.map((route) => (
                  <Route key={route.path} {...route} />
                ))}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            ) : null}
            <Route path="/settings" element={<Settings />} />
            <Route path="/invite" element={<InvitePage />} />
            <Route path="/ReferralConfirm" element={<ReferralConfirm />} />
          </Routes>
        </Router>
      </>
    );
  };

  export default InitMiniApp;
