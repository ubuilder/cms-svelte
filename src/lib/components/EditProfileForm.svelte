<script lang="ts">

    import FilePicker from '$lib/components/content/FilePicker.svelte'
	import { t } from "$lib/i18n"
	import { Card, Page, CardBody, Button, ButtonList, FormInput, CardFooter, FormField, Alert, Layout } from "@ulibs/yesvelte"

    export let user: any = {};
    export let successMessage = '';


</script>

<Page>
    <form method="POST" on:submit|preventDefault>
        <Card>
            <CardBody>
                <FormInput bind:value={user.username} name="username" label={t('profile.username')}/>
                <FormInput bind:value={user.name} name="name" label={t('profile.name')}/>
                <FormInput bind:value={user.email} name="email" label={t('profile.email')}/>
    
                <FormField label={t('profile.profile_image')}>
                    <FilePicker  bind:value={user.profile} type="image" name="profile"/>
                </FormField>
                
            </CardBody>
            {#if successMessage}
            <CardBody>

                <Alert color='success'>
                    Profile updated successfully!
                </Alert>
            </CardBody>

            {/if}

            <!-- <CardFooter>
                <ButtonList ms="auto">
                    <Button disabled href="..">{t('buttons.cancel')}</Button>
    
                    <Button type="submit" color="primary">{t('buttons.update')}</Button>
                </ButtonList>
            </CardFooter>
     -->
        </Card>
    </form>


</Page>
