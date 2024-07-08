import BottomBar from './BottomBar';
import TopBar from './TopBar';

export default function Layout({children}) {
  return (
    <div className="layout">
      <header className='z-10'><TopBar /></header>
      <main className='pt-24'>{children}</main>
      {/* <footer className='bottom-0 pt-96'><BottomBar /></footer> */}
    </div>
  );
};
