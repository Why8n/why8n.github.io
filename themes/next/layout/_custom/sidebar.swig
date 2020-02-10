{% if site.tags.length > 1 %}
<script type="text/javascript" charset="utf-8" src="/js/tagcloud.js"></script>
<script type="text/javascript" charset="utf-8" src="/js/tagcanvas.js"></script>
<div class="widget-wrap">
    <h3 class="widget-title">{{ __('tag_cloud_name') }}</h3>
    <div id="myCanvasContainer" class="widget tagcloud">
        <canvas width="250" height="250" id="resCanvas" style="width=100%">
            {{ list_tags() }}
        </canvas>
    </div>
</div>
{% endif %} 

{% if theme.recent_posts %}
  <div class="links-of-blogroll motion-element {{ "links-of-blogroll-" + theme.recent_posts_layout  }}">
   <div class="links-of-blogroll-title">
     <!-- modify icon to fire by szw -->
     <i class="fa fa-history fa-{{ theme.recent_posts_icon | lower }}" aria-hidden="true"></i>
     {{ theme.recent_posts_title || __('recent_posts_title') }}
   </div>
   <ul class="links-of-blogroll-list">
     {% set posts = site.posts.sort('-date') %}
     {% for post in posts.slice('0', '5') %}
       <li>
         <a href="{{ url_for(post.path) }}" title="{{ post.title }}" target="_blank">{{ post.title }}</a>
       </li>
     {% endfor %}
   </ul>
 </div>


<div class="site_total_count">
  <span class="post-count">博客全站共 <strong>{{ totalcount(site) }}</strong> 字</span>
</div>