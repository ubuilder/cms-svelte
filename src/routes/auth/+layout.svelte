<script>
    import '@ulibs/yesvelte/styles.css';
</script>

<slot />


<style>
    :global(:root) {
        --border-color: var(--y-border-color);
    }
</style>