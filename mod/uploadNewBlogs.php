<?php
$userUsername = $_POST['username'];
$userPassword = $_POST['password'];

$userUsername = htmlspecialchars($userUsername);
$userPassword = htmlspecialchars($userPassword);

$servernameAuthorisation = 'localhost';
$usernameAuthorisation = "strumixii_mod";
$passwordAuthorisation = "3.MWU!7!G^5v";
$dbnameAuthorisation = 'strumixii_Mod_data';

$connAuthorisation = new mysqli($servernameAuthorisation, $usernameAuthorisation, $passwordAuthorisation, $dbnameAuthorisation);
$connAuthorisation->set_charset("utf8mb4");
if ($connAuthorisation->connect_error) {
  die('Database connection failed');
}

$sqlAuthorisation = "SELECT * FROM modEntry WHERE email = '$userUsername' AND password = '$userPassword'";
$resultAuthorisation = $connAuthorisation->query($sqlAuthorisation);

if ($resultAuthorisation->num_rows > 0) {
  function sanitizeUrl($url)
  {
    $url = trim($url);
    $url = preg_replace('/[^A-Za-z0-9\-ا-ی]/u', '-', $url);
    $url = preg_replace('/-+/', '-', $url);
    return $url;
  }
  $url = htmlspecialchars($_POST['url']);
  $title = htmlspecialchars($_POST['title']);
  $description = htmlspecialchars($_POST['description']);
  $date = htmlspecialchars($_POST['date']);
  $dateEn = htmlspecialchars($_POST['dateEn']);
  $imgWidth = htmlspecialchars($_POST['imgWidth']);
  $content = $_POST['content'];
  $tags = htmlspecialchars($_POST['tags']);

  if (preg_match('/index/', $url)) {
    die("URL not accepted");
  }

  $url = sanitizeUrl($url);


  $tags = htmlspecialchars($_POST['tags']);

  $tagsArray = explode(',', $tags);

  $blogTagsSection = '';
  foreach ($tagsArray as $index => $tag) {
    $tag = trim($tag);

    $blogTagsSection .= '<a data-cursor="pointerClickable" href="">#' . $tag . '</a>';
    if ($index < count($tagsArray) - 1) {
      $blogTagsSection .= '<span>&nbsp;&nbsp;/&nbsp;&nbsp;</span>';
    }
  }

  $new_file = '../blogs/' . $url . '.html';

  $html_content = "<!DOCTYPE html>
<html lang='en'>

<head>
  <meta charset='UTF-8' />
  <meta name='viewport' content='width=device-width, initial-scale=1.0' />
  <meta http-equiv='X-UA-Compatible' content='IE=edge' />
  <meta name='robots' content='index, follow' />
  <link rel='apple-touch-icon' sizes='180x180' href='../assets/faviconPackage/apple-touch-icon.png'>
  <link rel='icon' type='image/png' sizes='32x32' href='../assets/faviconPackage/favicon-32x32.png'>
  <link rel='icon' type='image/png' sizes='16x16' href='../assets/faviconPackage/favicon-16x16.png'>
  <link rel='manifest' href='../assets/faviconPackage/site.webmanifest'>
  <link rel='mask-icon' href='../assets/faviconPackage/safari-pinned-tab.svg' color='#5bbad5'>
  <meta name='msapplication-TileColor' content='#da532c'>
  <meta name='theme-color' content='#ffffff'> 
  <title>" . $title . "</title>
  <meta name='description' content='" . $description . "' />
  <meta name='keywords' content='" . $tags . "' />
  <meta name='robots' content='index, follow' />
  <meta property='og:title' content='" . $title . "' />
  <meta property='og:description' content='" . $description . "' />
  <meta property='og:image' content='https://strumix.com/serverAssets/blogsCoverImg/" . $url . ".jpg' />
  <meta property='og:url' content='https://strumix.com/blogs/" . $url . "' />
  <meta name='twitter:title' content='" . $title . "' />
  <meta name='twitter:description' content='" . $description . "' />
  <meta name='twitter:image' content='https://strumix.com/serverAssets/blogsCoverImg/" . $url . ".jpg' />
  <script type='application/ld+json'>
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        'headline': '" . $title . "',
        'image': ['https://strumix.com/serverAssets/blogsCoverImg/" . $url . ".jpg'],
        'datePublished': '" . $dateEn . "',
        'keywords': '" . $tags . "'
      }
    </script>
  <script async='' src='https://www.googletagmanager.com/gtag/js?id=G-4PJ8JE8SW8'></script>
  <script src='../src/js/googleAnalytics.js'></script>

  <script src='https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js'></script>
  <script src='https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js'></script>
  <script src='https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js'></script>
  <script src='https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/TextPlugin.min.js'></script>
  <script src='https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/CSSRulePlugin.min.js'></script>
  <script src='../src/js/ScrollSmoother.min.js'></script>
  <script src='../src/js/SplitText.min.js'></script>

  <script async='' src='../src/blogs/cacheUpdator.js'></script>
  <script async='' src='../src/blogs/index.js'></script>

  <link rel='stylesheet' href='../src/css/main.css' />
  <link rel='stylesheet' href='../src/blogs/index.css' />
  <style>
    .mainBlogContainer img {
      width: " . $imgWidth . "%;
    }
  </style>
</head>

<body>
  <section class='splashScreen' data-cursor='pointerWaveBorder'>
    <p>
      Strumix
      <svg viewBox='0 0 337 255' fill='none'>
        <path class='svg-path' />
      </svg>
    </p>
    <p>بسپار بتن ايرانيان هوشمند</p>
  </section>
  <section class='settings'>
    <div class='changeTheme'>
      <img src='../assets/VectorNight.svg' alt='Vector dark mode' />
    </div>
    <div class='copyButton'>
      <p>کپی لینک صفحه!</p>
      <img src='../assets/VectorShare.svg' alt='Vector copy' />
    </div>
    <div>
      <img src='../assets/VectorPhone.svg' alt='Vector phone' />
    </div>
    <div>
      <a target='_blank' href='https://api.whatsapp.com/send?phone=989122087393'>
        <p>پشتیبانی فنی</p>
      </a>
      <a target='_blank' href='https://api.whatsapp.com/send?phone=989928210625'>
        <p>پشتیبانی فروش</p>
      </a>
      <a href='tel:02144403448'>
        <p>تلفن تماس</p>
        <p>021-44403448</p>
      </a>
      <a href='tel:021-44000408'>
        <p>تلفن تماس 2</p>
        <p>021-44000408</p>
      </a>
      <a href='mailto:info@strumix.com'>
        <p>ایمیل</p>
        <p>info@strumix.com</p>
      </a>
    </div>
  </section>
  <main id='smooth-wrapper'>
    <div id='smooth-content'>
      <section class='hero'>
        <img src='../assets/VectorLogo.svg' alt='Strumix logo' />
        <h1>" . $title . "</h1>
      </section>
      <section class='section2'>
        <header class='magnetic-wrap'>
          <a class='mouseSticky' href='./' data-cursor='pointerClickable'>لیست مقالات</a>
          <a class='mouseSticky' href='../' data-cursor='pointerClickable'>صفحه‌ی اصلی</a>
          <a class='mouseSticky' href='../products/index.html' data-cursor='pointerClickable'>کاتالوگ محصولات</a>
          <a class='mouseSticky' href='../contact/index.html' data-cursor='pointerClickable'>ارتباط با ما</a>
          <a class='mouseSticky' href='../' data-cursor='pointerClickable'>استرامیکس</a>
          <span>&nbsp;&nbsp;/&nbsp;&nbsp;</span>
          <a class='mouseSticky' data-cursor='pointerClickable'>" . $date . "</a>
        </header>
        <div class='mainBlogContainer'>" . $content . "</div>
        <div class='blogTags'>" . $blogTagsSection . "</div>
      </section>
      <section class='section3'>
        <div class='cardsContainer'></div>
      </section>
      <section class='section4' data-cursor='pointerWhite'>
        <p>بهترین مطالب هر ما</p>
        <p>ارسال میشه به صندوق پستی شما!</p>
        <input data-cursor='pointerClickable' type='email' id='email' name='email' placeholder='ایمیل'
          oninput='validateEmailInput(this)' />
        <p id='emailFeedback'></p>
        <p>این بالا کلیک کن و ایمیلت رو بنویس</p>
        <p class='mouseSticky' data-cursor='pointerClickable' onclick='processEmailInput()'>
          <span class='iconFlesh'></span>ثبت
        </p>
        <div>
          <a data-cursor='pointerFocus' href='../'>صفحه‌ی اصلی</a>
          <a data-cursor='pointerFocus' href='../products/index.html'>کاتالوگ محصولات</a>
          <a data-cursor='pointerFocus'>info@strumix.com</a>
          <a data-cursor='pointerFocus' href='../contact/index.html'>ارتباط با ما</a>
        </div>
      </section>
      <section class='section5SpaceHolder'></section>
    </div>
    <section class='section5' data-cursor='pointerWhite'>
      <div>
        <div class='infiniteScrollText' data-cursor='pointerWaveBorder'>
          <div>
            <span>Strumix&nbsp;&nbsp;-&nbsp;&nbsp;</span>
            <span>Strumix&nbsp;&nbsp;-&nbsp;&nbsp;</span>
            <span>Strumix&nbsp;&nbsp;-&nbsp;&nbsp;</span>
            <span>Strumix&nbsp;&nbsp;-&nbsp;&nbsp;</span>
            <span>Strumix&nbsp;&nbsp;-&nbsp;&nbsp;</span>
            <span>Strumix&nbsp;&nbsp;-&nbsp;&nbsp;</span>
            <span>Strumix&nbsp;&nbsp;-&nbsp;&nbsp;</span>
            <span>Strumix&nbsp;&nbsp;-&nbsp;&nbsp;</span>
            <span>Strumix&nbsp;&nbsp;-&nbsp;&nbsp;</span>
          </div>
        </div>
        <div class='infiniteScrollText' data-cursor='pointerWaveBorder'>
          <div>
            <span>&nbsp;-&nbsp;بسپار بتن ايرانيان هوشمند</span>
            <span>&nbsp;-&nbsp;بسپار بتن ايرانيان هوشمند</span>
            <span>&nbsp;-&nbsp;بسپار بتن ايرانيان هوشمند</span>
            <span>&nbsp;-&nbsp;بسپار بتن ايرانيان هوشمند</span>
          </div>
        </div>
      </div>
      <div>
        <a data-cursor='pointerClickable' href='' target='_blank'>
          <span class='iconFlesh'></span>
          <p>نمایش یکی از مقالات به صورت تصادفی</p>
          <span></span>
        </a>
        <a data-cursor='pointerClickable' href='./index.html'>
          <span class='iconFlesh'></span>
          <p>لیست مقالات</p>
          <span></span>
        </a>
        <a data-cursor='pointerClickable' target='_blank' href='https://www.instagram.com/strumix.co/'>
          <span class='iconFlesh'></span>
          <p>اخبار و مقالات دیگر در اینستاگرام ما</p>
          <span></span>
        </a>
      </div>
    </section>
  </main>
</body>

</html>";

  if (file_put_contents($new_file, $html_content)) {
    echo "صفحه جدید با موفقیت ایجاد شد: <a href='" . $new_file . "'>" . $new_file . "</a>";


    $sitemapFile = '../sitemap.xml';
    $newUrl = "https://strumix.com/blogs/" . $url;

    if (file_exists($sitemapFile)) {
      $doc = new DOMDocument('1.0', 'UTF-8');
      $doc->preserveWhiteSpace = false;
      $doc->formatOutput = true;
      $doc->load($sitemapFile);

      $urlset = $doc->getElementsByTagName('urlset')->item(0);
      if ($urlset) {
        $urls = $urlset->getElementsByTagName('url');
        $toRemove = [];
        foreach ($urls as $urlElement) {
          /** @var DOMElement $urlElement */
          $locNodes = $urlElement->getElementsByTagName('loc');
          if ($locNodes->length > 0 && trim($locNodes->item(0)->nodeValue) === $newUrl) {
            $toRemove[] = $urlElement;
          }
        }
        foreach ($toRemove as $urlElement) {
          $urlset->removeChild($urlElement);
        }

        $newUrlElement = $doc->createElement('url');
        $loc = $doc->createElement('loc', $newUrl);
        $newUrlElement->appendChild($loc);
        $lastmod = $doc->createElement('lastmod', date('Y-m-d'));
        $newUrlElement->appendChild($lastmod);

        $urlset->appendChild($newUrlElement);

        $doc->save($sitemapFile);
        echo "سایت مپ با موفقیت به‌روزرسانی شد.";
      } else {
        echo "ساختار فایل sitemap.xml نامعتبر است. تگ <urlset> یافت نشد.";
      }
    } else {
      echo "فایل sitemap.xml یافت نشد.";
    }
  } else {
    echo 'خطا در ایجاد صفحه.';
  }
} else {
  echo "خطا: اطلاعات ورود به سیستم صحیح نیست.";
}


$connAuthorisation->close();