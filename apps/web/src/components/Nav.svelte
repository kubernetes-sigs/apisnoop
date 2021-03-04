<script>
 export let segment;
</script>

<nav>
  <ul>
    <li> <img src='/logo.png' alt="apisnoop logo, a magnifying glass with a 3 color pie chart inside."/></li>
    <li><a aria-current="{segment === 'Home' ? 'page' : undefined}" href=".">home</a></li>
    <li><a aria-current="{segment === 'About' ? 'page' : undefined}" href="about">about</a></li>
    <!-- <li><a rel=prefetch aria-current="{segment === 'conformance-progress' ? 'page' : undefined}" href="conformance-progress">conformance progress</a></li> -->
  </ul>
</nav>

<style>
 nav {
   background: #9EEBCF;
   color: #5E2CA5;
   border-bottom: 1px solid rgba(255,62,0,0.1);
   font-weight: 300;
   padding: 0 1em;
 }

 ul {
   margin: 0;
   padding: 0;
 }

 /* clearfix */
 ul::after {
   content: '';
   display: block;
   clear: both;
 }

 li {
   display: block;
   float: left;
 }

 [aria-current] {
   position: relative;
   display: inline-block;
 }

 [aria-current]::after {
   position: absolute;
   content: '';
   width: calc(100% - 1em);
   height: 2px;
   background-color: rgb(255,62,0);
   display: block;
   bottom: -1px;
 }

 a {
   text-decoration: none;
   padding: 1em 0.5em;
   display: block;
 }
 li img {
   width: 50px;
 }
</style>

