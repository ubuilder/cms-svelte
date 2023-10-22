<script lang="ts">
  import { enhance } from "$app/forms";
  import {
    ButtonList,
    Layout,
    Page,
    Card,
    CardBody,
    CardFooter,
    CardActions,
    Button,
    FormInput,
    El,
    CardHeader,
	Alert,
  } from "@ulibs/yesvelte";
  // import { Identity, routeTo } from '@services'
  // import { news, user } from '@stores'
  // import Logo from '@components/layout/Logo.svelte'

  export let form;
  export let data;


  let loading = false;

</script>

<Layout
  theme={data.theme}
  sidebar={false}
  header={false}>
  <Page title="" htmlTitle="Register">
    <El
      mt="5"
      pt="5"
      row>
      <El
        colSm="2"
        colMd="3"
        colXl="4"
        d="none"
        dSm="block" />
      <El
        colSm="8"
        colMd="6"
        colXl="4">
        <form
          method="POST"
          
          use:enhance>
          <Card>
            <CardHeader
              py="3"
              px="4">
              <El mb="0" tag="h1">Create Account</El>
            </CardHeader>
            {#if data.fromLogin || data.fromAdmin}

            <CardBody>
              <El>
                <Alert color="warning">
                  {#if data.fromLogin || data.fromAdmin}
                    You don't have account, please register! 
                  {/if}
                </Alert>
              </El>
            </CardBody>
            {/if}
            <CardBody>
              <FormInput
                name="name"
                value=""
                label="Name"
                required
                col="12"
                state={form?.field === "name" ? "invalid" : undefined}
                hint={form?.field === "name" ? form?.message : ""} />
                <FormInput
                name="email"
                value=""
                label="Email"
                required
                col="12"
                state={form?.field === "email" ? "invalid" : undefined}
                hint={form?.field === "email" ? form?.message : ""} />
              <FormInput
                name="username"
                value=""
                label="Username"
                required
                col="12"
                state={form?.field === "username" ? "invalid" : undefined}
                hint={form?.field === "username" ? form?.message : ""} />
              <FormInput
                value=""
                label="Password"
                name="password"
                type="password"
                state={form?.field === "password" ? "invalid" : undefined}
                hint={form?.field === "password" ? form?.message : ""}
                autocomplete
                required
                col="12" />
            </CardBody>
            <CardFooter>
              <CardActions>
                <ButtonList>
                
                  
                  <!-- <Button
                  ghost 
                  color="secondary"
                    type="button"
                    on:click={async () => await goto("/auth/forgot-password")}>
                    Forgot Password?
                  </Button> -->
                  <Button
                    type="submit"
                    color="primary"
                    {loading}>Register</Button>
                </ButtonList>
              </CardActions>
            </CardFooter>
          </Card>
        </form>
      </El>
      <El
        colSm="2"
        colMd="3"
        colXl="4"
        d="none"
        dSm="block" />
    </El>
  </Page>
</Layout>
