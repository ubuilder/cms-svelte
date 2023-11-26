import { driver } from "driver.js";
// 
export function startTour(state, onDestroy = undefined){
    let driverObj = driver()
    
    if(state === 'home'){
        if(localStorage.getItem("navigator-home") == 'true') return;
     driverObj.setConfig({
        popoverClass: 'navigator-popover-class',
        showProgress: true,
        onDestroyed : ()=>localStorage.setItem("navigator-home", "true"),
        steps: [
          { element: '.nothing', popover: { title: 'Wellcom to UBuilder CMS', description: 'Ubuilder CMS is an opensource CMS, the main goal of Ubuilder is to bring simplicity to no code web development' } },
          { element: '.nothing', popover: { title: 'You can use arrow keys', description: 'You can use left and right arrow key to navigate between steps' } },
          { element: '#main-sections', popover: { title: 'Main Sections', description: 'Provides you with the main sections of CMS' } },
          { element: '.pages-button', popover: { title: 'Pages', description: 'You can View and manage pages' } },
          { element: '.assets-button', popover: { title: 'Database', description: 'You can View and manage Data' } },
          { element: '.databases-button', popover: { title: 'Assets', description: 'You can upload and manage your assets and files' } },
          { element: '.responsive-section', popover: { title: 'Responsive Design', description: 'You can make different designs for different screen sizes and devices' } },
          { element: '.xl-responsive-mode', popover: { title: 'Desktop', description: 'This is the default design size whick applyes to all screen sizes' } },
          { element: '.sm-responsive-mode', popover: { title: 'Mobile', description: 'This is the smalles screen size which is good for different mobile screens' } },
          { element: '.components-section', popover: { title: 'Components', description: 'Your Can Open list of Components to start design with.' } },
          { element: '.nothing', popover: { title: 'Ready to go!', description: 'Good luck with your journy of creating your dream pages with UBuilder CMS' } },
          { element: '.nothing', popover: { title: 'Click to Create your first Page', description: '' } },
        ]
      });
      setTimeout(()=>{
        driverObj.drive();
      }, 3000)
      return driverObj
    }else if(state == 'page-create'){
        if(localStorage.getItem("navigator-page-create") == 'true')return; 
            driverObj.setConfig({
                popoverClass: 'navigator-popover-class',
                showProgress: true,
                onDestroyed : ()=>localStorage.setItem("navigator-page-create", "true"),
                steps: [
                  { element: '.sidebar-title-button', popover: { title: 'Click Add page', description: '' } },
                ]
              });
              setTimeout(()=>{
                driverObj.drive();
              }, 3000)
              return driverObj
    }else if (state === 'page-settings'){
        if(localStorage.getItem("navigator-page-settings") == 'true'){(onDestroy&& onDestroy())return;};
        driverObj.setConfig({
            popoverClass: 'navigator-popover-class',
            showProgress: true,
            onDestroyed : ()=>{(onDestroy && onDestroy());localStorage.setItem("navigator-page-settings", "true")},
            steps: [
              { element: '.page-edit-icon', popover: { title: 'Go to Page settings', description: '' } },
            ]
          });
          setTimeout(()=>{
            driverObj.drive();
          }, 3000)
          return driverObj
        
    }else if( state === 'profile-button'){
        if(localStorage.getItem("navigator-profile-button") == 'true'){(onDestroy&& onDestroy())return;};
        driverObj.setConfig({
            popoverClass: 'navigator-popover-class',
            showProgress: true,
            onDestroyed : ()=>localStorage.setItem("navigator-profile-button", "true"),
            steps: [
              { element: '.profile-button', popover: { title: 'Go to Profile', description: 'Set profile settings' } },
            ]
          });
          setTimeout(()=>{
            driverObj.drive();
          }, 3000)
          return driverObj
    }else if( state === 'profile-settings'){
        if(localStorage.getItem("navigator-profile-settings") == 'true')return;
        driverObj.setConfig({
            popoverClass: 'navigator-popover-class',
            showProgress: true,
            onDestroyed : ()=>localStorage.setItem("navigator-profile-settings", "true"),
            steps: [
              { element: '.profile-settings', popover: { title: 'Go to Profile', description: 'Set profile settings' } },
            ]
          });
          setTimeout(()=>{
            driverObj.drive();
          }, 3000)
          return driverObj
    }else if( state === 'choose-home-page'){
        if(localStorage.getItem("navigator-home-page") == 'true')return;
        driverObj.setConfig({
            popoverClass: 'navigator-popover-class',
            showProgress: true,
            onDestroyed : ()=>localStorage.setItem("navigator-home-page", "true"),
            steps: [
              { element: '.choose-home-page', popover: { title: 'Select your home page', description: '' } },
            ]
          });
          setTimeout(()=>{
            driverObj.drive();
          }, 3000)
          return driverObj
    }else if( state === 'component-button'){
        if(localStorage.getItem("navigator-component-button") == 'true')return;
        driverObj.setConfig({
            popoverClass: 'navigator-popover-class',
            showProgress: true,
            onDestroyed : ()=>localStorage.setItem("navigator-component-button", "true"),
            steps: [
              { element: '.components-section', popover: { title: 'Open components list', description: '' } },
            ]
          });
          setTimeout(()=>{
            driverObj.drive();
          }, 3000)
          return driverObj
    }else if( state === 'component-list'){
        if(localStorage.getItem("navigator-component-list") == 'true')return;
        driverObj.setConfig({
            popoverClass: 'navigator-popover-class',
            showProgress: true,
            onDestroyed : ()=>localStorage.setItem("navigator-component-list", "true"),
            steps: [
              { element: '.component-list', popover: { title: 'Drag your favorite Component', description: '' } },
              { element: '.nothing', popover: { title: 'Good luck with rest of your design', description: '' } },
            ]
          });
          setTimeout(()=>{
            driverObj.drive();
          }, 3000)
          return driverObj
    }else{
        driverObj.destroy()
    }


    
}
