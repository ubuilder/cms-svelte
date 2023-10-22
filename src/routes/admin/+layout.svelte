<script>
  import {
    Avatar,
    Button,
    Card,
    CardActions,
    CardBody,
    CardHeader,
    CardTitle,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    El,
    SidebarItem,

    Layout
  } from "@ulibs/yesvelte";
  import '@ulibs/yesvelte/styles.css';
  import '../../app.css';

  import { goto } from "$app/navigation";
  import { setLang, t } from "$lib/i18n";

  export let data;

  setLang(data.lang)

  const show_auth_warning = true;

  async function logout() {
    const result = await fetch("/auth?/logout", {
      method: "POST",
      body: JSON.stringify({}),
    }).then((res) => res.json());

    goto("/auth/login");
  }

  function hasAccess() {
    return !!data.user;
  }
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=family=Vazirmatn:wght@400;700&display=swap" rel="stylesheet">

</svelte:head>
<!-- <SidebarItem title="داشبورد" icon="dashboard" href="/admin" />
<SidebarItem title="محتوا" icon="database" href="/admin/content" />
<SidebarItem title="صفحات" href="/admin/pages" icon="file" />
<SidebarItem title="فایل ها" href="/admin/assets" icon="photo" />
<SidebarItem title="اپلیکیشن ها" href="/admin/market" icon="building-store" />
<SidebarItem title="تست بک اند" href="/admin/test" icon="test" />
<SidebarItem title="تنظیمات" href="/admin/settings" icon="settings" /> -->
<Layout title="UBuilder" theme={data.theme} dir={data.dir}>
  <svelte:fragment slot="sidebar-items">
    <SidebarItem title="{t('dashboard.title')}" icon="dashboard" href="/admin/" />
    <SidebarItem title="{t('content.title')}" icon="database" href="/admin/content/" />
    <SidebarItem title="{t('pages.title')}" href="/admin/pages/" icon="file" />
    <SidebarItem title="{t('components.title')}" href="/admin/components/" icon="box" />

    <SidebarItem title="{t('assets.title')}" href="/admin/assets/" icon="photo" />
    <SidebarItem title="{t('apps.title')}" href="/admin/apps/" icon="building-store" />
    <SidebarItem title="{t('settings.title')}" href="/admin/settings/" icon="settings" />
  
    <El my="2" />
    {#each data.menu as menu}
      <SidebarItem
        title={menu.title}
        href="{menu.href}"
        icon={menu.icon}
      />
    {/each}
  </svelte:fragment>
  <svelte:fragment slot="header-end">
    <El>
      {#if data.user}
        <Dropdown autoClose arrow={false} placement="bottom-end">
          <Avatar slot="target" shape="circle" color="primary">
            {#if data.user.profile}
              <img alt="profile" src="/files/{data.user.profile}" />
            {:else}
              <img alt="profile" src="/images/avatar.png" />
            {/if}
          </Avatar>
          <DropdownMenu >
            <DropdownItem href="/admin/profile">{t('profile.title')}</DropdownItem>
            <DropdownItem href="/admin/settings">{t('settings.title')}</DropdownItem>
            <DropdownItem divider />
            <DropdownItem href="/admin/logout">{t('layout.logout')}</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      {/if}
    </El>
  </svelte:fragment>
  {#if hasAccess()}
      <slot />
  {:else}
    <Card m="3">
      <CardHeader>
        <CardTitle>عدم دسترسی</CardTitle>
        <CardActions>
          <Button href="/auth/login">لاگین</Button>
        </CardActions>
      </CardHeader>
      <CardBody>شما به این صفحه دسترسی ندارید</CardBody>
    </Card>
  {/if}
</Layout>

<style>
  :global(.y-form-input .y-label) {
    padding: 0;
  }
</style>
