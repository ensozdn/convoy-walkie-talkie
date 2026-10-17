import { useEffect, useRef, useCallback } from 'react';
import { Animated, Easing } from 'react-native';

export function useUIAnimations({ lobbyMode, activeSpeaker }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const logoGlowAnim = useRef(new Animated.Value(0.35)).current;
  const logoScaleAnim = useRef(new Animated.Value(1)).current;
  const tabFadeAnim = useRef(new Animated.Value(1)).current;
  const tabSlideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(logoGlowAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(logoScaleAnim, {
            toValue: 1.04,
            duration: 1500,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(logoGlowAnim, {
            toValue: 0.3,
            duration: 1500,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(logoScaleAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [logoGlowAnim, logoScaleAnim]);

  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(20);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 280, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 280, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, lobbyMode, slideAnim]);

  useEffect(() => {
    if (activeSpeaker) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.09, duration: 550, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1.0, duration: 550, useNativeDriver: true }),
        ])
      );
      animation.start();
      return () => animation.stop();
    }
    pulseAnim.setValue(1);
    return undefined;
  }, [activeSpeaker, pulseAnim]);

  const animateTabTransition = useCallback(() => {
    tabFadeAnim.setValue(0.4);
    tabSlideAnim.setValue(6);
    Animated.parallel([
      Animated.timing(tabFadeAnim, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.timing(tabSlideAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start();
  }, [tabFadeAnim, tabSlideAnim]);

  return {
    fadeAnim,
    slideAnim,
    pulseAnim,
    logoGlowAnim,
    logoScaleAnim,
    tabFadeAnim,
    tabSlideAnim,
    animateTabTransition,
  };
}
