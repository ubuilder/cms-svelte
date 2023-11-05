<script>
    import {enhance} from '$app/forms'
	import { page } from '$app/stores'
	import AdminLayout from '$lib/components/AdminLayout.svelte'
	import FilePicker from '$lib/components/content/FilePicker.svelte'
	import { t } from "$lib/i18n"

    export let data;

	import { Card, Page, CardBody, Button, ButtonList, FormInput, CardFooter, FormField, Alert, Layout } from "@ulibs/yesvelte"

</script>
<AdminLayout {...data}>

<Page title={t('profile.title')}>
    <form method="POST" use:enhance>
        <Card>
            <CardBody>
                <FormInput bind:value={data.userData.username} name="username" label={t('profile.username')}/>
                <FormInput bind:value={data.userData.name} name="name" label={t('profile.name')}/>
                <FormInput bind:value={data.userData.email} name="email" label={t('profile.email')}/>
    
                <FormField label={t('profile.profile_image')}>
                    <FilePicker  bind:value={data.userData.profile} type="image" name="profile"/>
                </FormField>
                
            </CardBody>
            {#if $page.url.searchParams.has('success')}
            <CardBody>

                <Alert color='success'>
                    Profile updated successfully!
                </Alert>
            </CardBody>

            {/if}

            <CardFooter>
                <ButtonList ms="auto">
                    <Button disabled href="..">{t('buttons.cancel')}</Button>
    
                    <Button type="submit" color="primary">{t('buttons.update')}</Button>
                </ButtonList>
            </CardFooter>
    
        </Card>
    </form>


</Page>
</AdminLayout>
