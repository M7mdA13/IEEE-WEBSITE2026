<?php
require_once 'config.php';

$upcomingEvents = [];
$pastEvents = [];
$error = '';

try {
    $query = "SELECT * FROM events 
               WHERE status IN ('upcoming', 'ongoing', 'planning') 
              /* OR end_datetime >= NOW()   */
              ORDER BY start_datetime DESC";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $upcomingEvents = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $query = "SELECT * FROM events 
              WHERE status = 'completed' 
              ORDER BY start_datetime DESC";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $pastEvents = $stmt->fetchAll(PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    $error = 'Database error: ' . $e->getMessage();
}
?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
 
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Krona+One&display=swap"
      rel="stylesheet"
    />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100..900;1,100..900&display=swap"
      rel="stylesheet"
    />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
      rel="stylesheet"
    />
    <title>Events</title>
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
    />
    <link href="./src/output.css" rel="stylesheet" />
  </head>

  <body>
    <nav>
      <div class="logo">
        <img src="images/ieeebluelogo.png" alt="Logo" />
      </div>
      <div class="nav-container">
        <div class="nav-links">
          <a href="../home_page/index.html">Home</a>
          <a href="../committees_page/committees.html" class="active">Committees</a>
          <a href="event-user.php">Events</a>
          <a href="#">Membership</a>
          <a href="../AI assistant/ai.html" class="ask-ai-btn">Ask AI</a>
          <a href="#">About us</a>
        </div>
        <div class="search">
          <i class="fas fa-search search-icon"></i>
          <input type="text" placeholder="Search..." />
        </div>
      </div>
      <div class="mobile-nav">
        <button class="hamburger">
          <i class="fas fa-bars"></i>
        </button>
      </div>
    </nav>

    <section class="our-vision gradient-bg">
      <div class="py-40 px-20 md:px-0">
        <h2
          class="font-montserrat text-[60px] md:text-[70px] font-[800] text-[#054377] text-center"
        >
          Our Events
        </h2>
        <?php if (!empty($upcomingEvents)): ?>
          <?php foreach ($upcomingEvents as $event): ?>
            <div
              class="our-vision-box text-center rounded-3xl mt-10 px-16 md:w-1/2 md:mx-auto committee-card"
            >
              <div
                class="flex flex-col md:flex-row items-center justify-between gap-6"
              >
                <div class="flex-1 text-left space-y-4">
                  <h2 class="text-xl md:text-2xl font-bold text-[#003B71]">
                    <?= htmlspecialchars($event['title']) ?>
                  </h2>
                  <p class="text-[#003B71] font-bold">
                    Date: <?= date('m/d/Y', strtotime($event['start_datetime'])) ?>
                  </p>
                  <p class="text-[#003B71] font-bold">
                    Time: <?= date('h:i A', strtotime($event['start_datetime'])) ?>
                  </p>
                  <p class="text-[#003B71] font-bold">
                    Location: <?= htmlspecialchars($event['location']) ?>
                  </p>
                  <p class="text-[#3e566c] text-sm md:text-base">
                    <?= htmlspecialchars($event['description']) ?>
                  </p>

             
<div class="flex flex-wrap gap-4 pt-2">
    <button class="bg-gradient-to-r from-[#00C6FF] to-[#0072FF] text-white font-semibold py-2 px-6 rounded-full transition-transform duration-300 hover:scale-105 cursor-pointer">
        <a href="<?= htmlspecialchars($event['register_link'] ?: '#') ?>">Register Now!</a>
    </button>
    <button class="border border-[#00C6FF] text-[#00C6FF] font-semibold py-2 px-6 rounded-full transition-transform duration-300 hover:scale-105 cursor-pointer">
        <a href="<?= htmlspecialchars($event['agenda_link'] ?: '#') ?>">Agenda</a>
    </button>
</div>
                </div>

                <div class="w-[200px] h-[250px] rounded-2xl overflow-hidden">
                  <?php if ($event['image_path'] && file_exists($event['image_path'])): ?>
                    <img
                      src="<?= htmlspecialchars($event['image_path']) ?>"
                      alt="Event image"
                      class="w-full h-full object-cover"
                    />
                  <?php else: ?>
                    <div class="w-full h-full bg-gray-200"></div>
                  <?php endif; ?>
                </div>
              </div>
            </div>
          <?php endforeach; ?>
        <?php else: ?>
          <div
            class="our-vision-box text-center rounded-3xl mt-10 px-16 md:w-1/2 md:mx-auto committee-card"
          >
            <p class="text-[#3e566c] text-base">No upcoming events at the moment.</p>
          </div>
        <?php endif; ?>
      </div>
    </section>

    <section>
      <div class="text-center gradient-bg">
        <div class="mb-12 px-20 md:px-0">
          <div class="flex items-center justify-center space-x-4">
            <div class="w-48 h-1 bg-blue-900"></div>
            <div class="text-[50px] md:text-[70px] text-blue-900 pb-5">
              <span class="capitalize font-bold">past events</span>
            </div>
            <div class="w-48 h-1 bg-blue-900"></div>
          </div>

          <?php if (!empty($pastEvents)): ?>
            <?php foreach ($pastEvents as $event): ?>
              <div
                class="our-vision-box text-center rounded-3xl md:w-1/2 md:mx-auto mt-10"
              >
                <div
                  class="flex flex-col md:flex-row items-center justify-between gap-6"
                >
                  <div class="w-[200px] h-[250px] rounded-2xl overflow-hidden">
                    <?php if ($event['image_path'] && file_exists($event['image_path'])): ?>
                      <img
                        src="<?= htmlspecialchars($event['image_path']) ?>"
                        alt="Event image"
                        class="w-full h-full object-cover"
                      />
                    <?php else: ?>
                      <div class="w-full h-full bg-gray-200"></div>
                    <?php endif; ?>
                  </div>

                  <div class="flex-1 text-left space-y-4">
                    <h2 class="text-xl md:text-2xl font-bold text-[#003B71]">
                      <?= htmlspecialchars($event['title']) ?>
                    </h2>
                    <p class="text-[#003B71] font-bold">
                      Date: <?= date('m/d/Y', strtotime($event['start_datetime'])) ?>
                    </p>
                    <p class="text-[#003B71] font-bold">
                      Time: <?= date('h:i A', strtotime($event['start_datetime'])) ?>
                    </p>
                    <p class="text-[#003B71] font-bold">
                      Location: <?= htmlspecialchars($event['location']) ?>
                    </p>
                    <p class="text-[#3e566c] text-sm md:text-base">
                      <?= htmlspecialchars($event['description']) ?>
                    </p>
                  </div>
                </div>
              </div>
            <?php endforeach; ?>
          <?php else: ?>
            <div
              class="our-vision-box text-center rounded-3xl md:w-1/2 md:mx-auto mt-10"
            >
              <p class="text-[#3e566c] text-base">No past events found.</p>
            </div>
          <?php endif; ?>
        </div>
      </div>
    </section>

    <section class="gradient-bg py-10">
      <div class="relative overflow-hidden">
        <div id="slider" class="flex transition-transform duration-500">
          <div class="min-w-full flex flex-wrap justify-center px-4">
            <div class="text-center w-full sm:w-1/2 lg:w-1/4 px-2 mb-6">
              <img
                src="./images/group pic 1.jpg"
                class="w-28 h-28 mx-auto rounded-full"
                alt=""
              />
              <h3 class="font-bold text-lg text-[#003B71] mt-4">
                Firstname Lastname
              </h3>
              <p class="text-sm text-[#003B71]">Software engineer</p>
              <a href="#" class="text-[#003B71] text-2xl mt-2 inline-block"
                ><i class="fab fa-linkedin"></i
              ></a>
            </div>
            <div class="text-center w-full sm:w-1/2 lg:w-1/4 px-2 mb-6">
              <img
                src="./images/group pic 2.jpg"
                class="w-28 h-28 mx-auto rounded-full"
                alt=""
              />
              <h3 class="font-bold text-lg text-[#003B71] mt-4">
                Firstname Lastname
              </h3>
              <p class="text-sm text-[#003B71]">Software engineer</p>
              <a href="#" class="text-[#003B71] text-2xl mt-2 inline-block"
                ><i class="fab fa-linkedin"></i
              ></a>
            </div>
            <div class="text-center w-full sm:w-1/2 lg:w-1/4 px-2 mb-6">
              <img
                src="./images/group pic 2.jpg"
                class="w-28 h-28 mx-auto rounded-full"
                alt=""
              />
              <h3 class="font-bold text-lg text-[#003B71] mt-4">
                Firstname Lastname
              </h3>
              <p class="text-sm text-[#003B71]">Software engineer</p>
              <a href="#" class="text-[#003B71] text-2xl mt-2 inline-block"
                ><i class="fab fa-linkedin"></i
              ></a>
            </div>
            <div class="text-center w-full sm:w-1/2 lg:w-1/4 px-2 mb-6">
              <img
                src="./images/group pic 2.jpg"
                class="w-28 h-28 mx-auto rounded-full"
                alt=""
              />
              <h3 class="font-bold text-lg text-[#003B71] mt-4">
                Firstname Lastname
              </h3>
              <p class="text-sm text-[#003B71]">Software engineer</p>
              <a href="#" class="text-[#003B71] text-2xl mt-2 inline-block"
                ><i class="fab fa-linkedin"></i
              ></a>
            </div>
          </div>

          <div class="min-w-full flex flex-wrap justify-center px-4">
            <div class="text-center w-full sm:w-1/2 lg:w-1/4 px-2 mb-6">
              <img
                src="./images/group pic 2.jpg"
                class="w-28 h-28 mx-auto rounded-full"
                alt=""
              />
              <h3 class="font-bold text-lg text-[#003B71] mt-4">
                Firstname Lastname
              </h3>
              <p class="text-sm text-[#003B71]">Software engineer</p>
              <a href="#" class="text-[#003B71] text-2xl mt-2 inline-block"
                ><i class="fab fa-linkedin"></i
              ></a>
            </div>
            <div class="text-center w-full sm:w-1/2 lg:w-1/4 px-2 mb-6">
              <img
                src="./images/group pic 2.jpg"
                class="w-28 h-28 mx-auto rounded-full"
                alt=""
              />
              <h3 class="font-bold text-lg text-[#003B71] mt-4">
                Firstname Lastname
              </h3>
              <p class="text-sm text-[#003B71]">Software engineer</p>
              <a href="#" class="text-[#003B71] text-2xl mt-2 inline-block"
                ><i class="fab fa-linkedin"></i
              ></a>
            </div>
            <div class="text-center w-full sm:w-1/2 lg:w-1/4 px-2 mb-6">
              <img
                src="./images/group pic 2.jpg"
                class="w-28 h-28 mx-auto rounded-full"
                alt=""
              />
              <h3 class="font-bold text-lg text-[#003B71] mt-4">
                Firstname Lastname
              </h3>
              <p class="text-sm text-[#003B71]">Software engineer</p>
              <a href="#" class="text-[#003B71] text-2xl mt-2 inline-block"
                ><i class="fab fa-linkedin"></i
              ></a>
            </div>
            <div class="text-center w-full sm:w-1/2 lg:w-1/4 px-2 mb-6">
              <img
                src="./images/group pic 2.jpg"
                class="w-28 h-28 mx-auto rounded-full"
                alt=""
              />
              <h3 class="font-bold text-lg text-[#003B71] mt-4">
                Firstname Lastname
              </h3>
              <p class="text-sm text-[#003B71]">Software engineer</p>
              <a href="#" class="text-[#003B71] text-2xl mt-2 inline-block"
                ><i class="fab fa-linkedin"></i
              ></a>
            </div>
          </div>
        </div>

        <div class="flex justify-center mt-6 space-x-2">
          <button
            class="dot w-3 h-3 rounded-full bg-[#003B71] cursor-pointer"
            data-index="0"
          ></button>
          <button
            class="dot w-3 h-3 rounded-full bg-gray-300 cursor-pointer"
            data-index="1"
          ></button>
        </div>

        <button
          id="prevBtn"
          class="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-lg w-10 h-10 flex items-center justify-center text-[#003B71] text-xl cursor-pointer"
        >
          &#8592;
        </button>
        <button
          id="nextBtn"
          class="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-lg w-10 h-10 flex items-center justify-center text-[#003B71] text-xl cursor-pointer"
        >
          &#8594;
        </button>
      </div>
    </section>

    <section class="gradient-bg pt-10">
      <div
        class="flex flex-col md:flex-row justify-center items-center gap-11 px-4 py-10"
      >
        <div
          class="w-64 h-56 rounded-2xl md:w-[350px] md:h-[250px] overflow-hidden transform -rotate-3 shadow-md"
        >
          <img
            src="images/group pic 1.jpg"
            alt="Left Group"
            class="w-full h-full object-cover"
          />
        </div>

        <div
          class="w-80 h-72 md:w-[400px] md:h-[300px] rounded-2xl overflow-hidden shadow-lg"
        >
          <img
            src="images/group pic 2.jpg"
            alt="Center Group"
            class="w-full h-full object-cover"
          />
        </div>

        <div
          class="w-64 h-56 rounded-2xl md:w-[350px] md:h-[250px] overflow-hidden transform rotate-3 shadow-md"
        >
          <img
            src="images/group pic 3.jpg"
            alt="Right Group"
            class="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>

    <section>
      <div class="text-center gradient-bg py-10 px-20 md:px-0">
        <?php if (!empty($pastEvents)): ?>
          <?php foreach (array_slice($pastEvents, count($pastEvents) > 1 ? 1 : 0) as $event): ?>
            <div
              class="our-vision-box text-center rounded-3xl md:w-1/2 md:mx-auto mt-10"
            >
              <div
                class="flex flex-col md:flex-row items-center justify-between gap-6"
              >
                <div class="flex-1 text-left space-y-4">
                  <h2 class="text-xl md:text-2xl font-bold text-[#003B71]">
                    <?= htmlspecialchars($event['title']) ?>
                  </h2>
                  <p class="text-[#003B71] font-bold">
                    Date: <?= date('m/d/Y', strtotime($event['start_datetime'])) ?>
                  </p>
                  <p class="text-[#003B71] font-bold">
                    Time: <?= date('h:i A', strtotime($event['start_datetime'])) ?>
                  </p>
                  <p class="text-[#003B71] font-bold">
                    Location: <?= htmlspecialchars($event['location']) ?>
                  </p>
                  <p class="text-[#3e566c] text-sm md:text-base">
                    <?= htmlspecialchars($event['description']) ?>
                  </p>
                </div>

                <div class="w-[200px] h-[250px] rounded-2xl overflow-hidden">
                  <?php if ($event['image_path'] && file_exists($event['image_path'])): ?>
                    <img
                      src="<?= htmlspecialchars($event['image_path']) ?>"
                      alt="Event image"
                      class="w-full h-full object-cover"
                    />
                  <?php else: ?>
                    <div class="w-full h-full bg-gray-200"></div>
                  <?php endif; ?>
                </div>
              </div>
            </div>
          <?php endforeach; ?>
        <?php endif; ?>
      </div>
    </section>

    <section class="gradient-bg py-10">
      <div class="relative overflow-hidden">
        <div id="team-slider" class="flex transition-transform duration-500">
          <div class="min-w-full flex flex-wrap justify-center px-4">
            <div class="text-center w-full sm:w-1/2 lg:w-1/4 px-2 mb-6">
              <img src="./images/group pic 1.jpg" class="w-28 h-28 mx-auto rounded-full" alt=""/>
              <h3 class="font-bold text-lg text-[#003B71] mt-4">Firstname Lastname</h3>
              <p class="text-sm text-[#003B71]">Software engineer</p>
              <a href="#" class="text-[#003B71] text-2xl mt-2 inline-block"><i class="fab fa-linkedin"></i></a>
            </div>
            <div class="text-center w-full sm:w-1/2 lg:w-1/4 px-2 mb-6">
              <img src="./images/group pic 1.jpg" class="w-28 h-28 mx-auto rounded-full" alt=""/>
              <h3 class="font-bold text-lg text-[#003B71] mt-4">Firstname Lastname</h3>
              <p class="text-sm text-[#003B71]">Software engineer</p>
              <a href="#" class="text-[#003B71] text-2xl mt-2 inline-block"><i class="fab fa-linkedin"></i></a>
            </div>
            <div class="text-center w-full sm:w-1/2 lg:w-1/4 px-2 mb-6">
              <img src="./images/group pic 1.jpg" class="w-28 h-28 mx-auto rounded-full" alt=""/>
              <h3 class="font-bold text-lg text-[#003B71] mt-4">Firstname Lastname</h3>
              <p class="text-sm text-[#003B71]">Software engineer</p>
              <a href="#" class="text-[#003B71] text-2xl mt-2 inline-block"><i class="fab fa-linkedin"></i></a>
            </div>
            <div class="text-center w-full sm:w-1/2 lg:w-1/4 px-2 mb-6">
              <img src="./images/group pic 1.jpg" class="w-28 h-28 mx-auto rounded-full" alt=""/>
              <h3 class="font-bold text-lg text-[#003B71] mt-4">Firstname Lastname</h3>
              <p class="text-sm text-[#003B71]">Software engineer</p>
              <a href="#" class="text-[#003B71] text-2xl mt-2 inline-block"><i class="fab fa-linkedin"></i></a>
            </div>
          </div>

          <div class="min-w-full flex flex-wrap justify-center px-4">
            <div class="text-center w-full sm:w-1/2 lg:w-1/4 px-2 mb-6">
              <img src="./images/group pic 2.jpg" class="w-28 h-28 mx-auto rounded-full" alt=""/>
              <h3 class="font-bold text-lg text-[#003B71] mt-4">Firstname Lastname</h3>
              <p class="text-sm text-[#003B71]">Software engineer</p>
              <a href="#" class="text-[#003B71] text-2xl mt-2 inline-block"><i class="fab fa-linkedin"></i></a>
            </div>
            <div class="text-center w-full sm:w-1/2 lg:w-1/4 px-2 mb-6">
              <img src="./images/group pic 2.jpg" class="w-28 h-28 mx-auto rounded-full" alt=""/>
              <h3 class="font-bold text-lg text-[#003B71] mt-4">Firstname Lastname</h3>
              <p class="text-sm text-[#003B71]">Software engineer</p>
              <a href="#" class="text-[#003B71] text-2xl mt-2 inline-block"><i class="fab fa-linkedin"></i></a>
            </div>
            <div class="text-center w-full sm:w-1/2 lg:w-1/4 px-2 mb-6">
              <img src="./images/group pic 2.jpg" class="w-28 h-28 mx-auto rounded-full" alt=""/>
              <h3 class="font-bold text-lg text-[#003B71] mt-4">Firstname Lastname</h3>
              <p class="text-sm text-[#003B71]">Software engineer</p>
              <a href="#" class="text-[#003B71] text-2xl mt-2 inline-block"><i class="fab fa-linkedin"></i></a>
            </div>
            <div class="text-center w-full sm:w-1/2 lg:w-1/4 px-2 mb-6">
              <img src="./images/group pic 2.jpg" class="w-28 h-28 mx-auto rounded-full" alt=""/>
              <h3 class="font-bold text-lg text-[#003B71] mt-4">Firstname Lastname</h3>
              <p class="text-sm text-[#003B71]">Software engineer</p>
              <a href="#" class="text-[#003B71] text-2xl mt-2 inline-block"><i class="fab fa-linkedin"></i></a>
            </div>
          </div>
        </div>

        <div class="flex justify-center mt-6 space-x-2">
          <button class="team-dot w-3 h-3 rounded-full bg-[#003B71] cursor-pointer" data-index="0"></button>
          <button class="team-dot w-3 h-3 rounded-full bg-gray-300 cursor-pointer" data-index="1"></button>
        </div>

        <button id="teamPrevBtn" class="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-lg w-10 h-10 flex items-center justify-center text-[#003B71] text-xl cursor-pointer">&#8592;</button>
        <button id="teamNextBtn" class="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-lg w-10 h-10 flex items-center justify-center text-[#003B71] text-xl cursor-pointer">&#8594;</button>
      </div>
    </section>

    <section class="gradient-bg pb-12">
      <div
        class="flex flex-col md:flex-row justify-center items-center gap-11 px-4 py-10"
      >
        <div
          class="w-64 h-56 rounded-2xl md:w-[350px] md:h-[250px] overflow-hidden transform -rotate-3 shadow-md"
        >
          <img
            src="images/group pic 1.jpg"
            alt="Left Group"
            class="w-full h-full object-cover"
          />
        </div>

        <div
          class="w-80 h-72 md:w-[400px] md:h-[300px] rounded-2xl overflow-hidden shadow-lg"
        >
          <img
            src="images/group pic 2.jpg"
            alt="Center Group"
            class="w-full h-full object-cover"
          />
        </div>

        <div
          class="w-64 h-56 rounded-2xl md:w-[350px] md:h-[250px] overflow-hidden transform rotate-3 shadow-md"
        >
          <img
            src="images/group pic 3.jpg"
            alt="Right Group"
            class="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>

    <footer>
      <div class="contact-info">
        <h3>Contact us</h3>
        <p>123.456.7890</p>
        <p><a href="mailto:info@example.com">info@example.com</a></p>
        <p>@welikeyoursite</p>
      </div>
      <div class="connect">
        <h3>Let's connect!</h3>
        <div class="social-container">
          <div class="social-links">
            <a href="#" class="social-link"
              ><i class="fab fa-facebook-f"></i
            ></a>
            <a href="#" class="social-link"><i class="fab fa-twitter"></i></a>
            <a href="#" class="social-link"><i class="fab fa-instagram"></i></a>
            <a href="#" class="social-link"
              ><i class="fab fa-linkedin-in"></i
            ></a>
          </div>
        </div>
      </div>
    </footer>

    <script src="./index.js"></script>
  </body>
</html>