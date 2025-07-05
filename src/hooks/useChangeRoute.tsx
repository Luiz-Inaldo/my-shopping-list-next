import React from 'react'
import { useRouter } from 'next/navigation'

const useChangeRoute = () => {
  const [isChangingRoute, setIsChangingRoute] = React.useState(false);
  const router = useRouter();

  const handleChangeRoute = (route: string) => {
    setIsChangingRoute(true);
    setTimeout(() => {
      router.push(route);
    }, 1000);
  };

  return {
    isChangingRoute,
    handleChangeRoute,
  };
}

export default useChangeRoute