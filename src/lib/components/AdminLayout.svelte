<script lang="ts">
	import { t } from "$lib/i18n"


	import {Avatar, Button, Dropdown, DropdownItem, DropdownMenu, El, Icon, Layout} from "@ulibs/yesvelte"

export let theme = 'dark'
export let dir = 'ltr'
export let user: any = {};

function toggleTheme() {
    if(theme === 'light') {
      theme = 'dark'
    } else {
      theme = 'light'
    }
  }
</script>

<Layout sidebar={false}  {theme}  {dir}>
    <El tag="a" href="/edit" style="color: var(--y-body-color)" slot="logo">
        <El tag="h1" mb="0">UBuilder</El>
    </El>
    <El d="flex" alignItems="center"  slot="header-end">
        <Button on:click={() => toggleTheme()} ghost color="secondary">
          {#if theme === 'dark'}
          <Icon name="sun"/>
          {:else}
          <Icon name="moon"/>
          {/if}
          
        </Button>
        <Dropdown autoClose arrow={false} placement="bottom-end">
          <Avatar slot="target" shape="circle" color="primary">
            {#if user.profile}
              <img alt="profile" src="/files/{user.profile}" />
            {:else}
              <img alt="profile" src="/images/avatar.png" />
            {/if}
          </Avatar>
          <DropdownMenu >
            <DropdownItem href="/edit/profile">{t('profile.title')}</DropdownItem>
            <DropdownItem href="/edit/settings">{t('settings.title')}</DropdownItem>
            <DropdownItem divider />
            <DropdownItem href="/edit/logout">{t('layout.logout')}</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        
      </El>
    <slot/>
</Layout>