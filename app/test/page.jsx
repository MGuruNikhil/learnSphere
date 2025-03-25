"use client";

import { useState, useEffect } from "react";

// Your raw JSON text inside a markdown code block.
const rawText = `\`\`\`json
[
  {
    "chapter": "Understanding Special Entry Darshan (SED)",
    "pages": [
      {
        "pageNumber": 1,
        "title": "What is Special Entry Darshan?",
        "content": "Special Entry Darshan (SED), also known as '₹300 Darshan', is a paid service offered by Tirumala Tirupati Devasthanams (TTD) that allows pilgrims to enter the temple with a shorter waiting time compared to the free Sarva Darshan. It is designed to provide a more organized and convenient darshan experience. The primary purpose is to manage the huge influx of devotees visiting Tirumala every day and to provide an alternative option for those who are willing to pay for a quicker entry. The SED system allows devotees to book specific time slots online, reducing the unpredictability and lengthy queues often associated with general darshan. This option caters to pilgrims who may have time constraints or prefer a more structured experience. Through the official TTD website, pilgrims can select their preferred date and time for darshan, ensuring a more predictable and manageable visit. This system contributes to the overall efficiency of managing the temple's darshan process and caters to the diverse needs of the visiting devotees, offering a balance between free and paid options for accessing the sacred shrine of Lord Venkateswara."
      },
      {
        "pageNumber": 2,
        "title": "Benefits of SED",
        "content": "The Special Entry Darshan (SED) offers a multitude of benefits that enhance the overall pilgrimage experience. The most significant advantage is the drastically reduced waiting time compared to Sarva Darshan. This allows devotees to utilize their time more effectively, spending less time in queues and more time in contemplation and spiritual activities. Furthermore, the pre-booked time slots enable pilgrims to plan their trip more accurately, minimizing uncertainty and ensuring a more structured itinerary. SED also provides a more orderly entry into the temple, reducing congestion and improving the overall flow of devotees. This contributes to a calmer and more peaceful darshan experience. Often, SED tickets include access to specific queue lines designated for ticket holders, which further expedites the entry process. In some cases, SED tickets may also include complimentary prasadam, adding value to the offering. Ultimately, the SED system aims to provide a comfortable, efficient, and fulfilling darshan experience for pilgrims who seek a more organized and time-saving approach to visiting the sacred shrine."
      },
      {
        "pageNumber": 3,
        "title": "Cost of SED",
        "content": "The cost of a Special Entry Darshan (SED) ticket at Tirumala Tirupati Devasthanams (TTD) is ₹300 per person. This price is inclusive of certain privileges that enhance the darshan experience. It's important to note that this cost is subject to change at the discretion of the TTD management, so it's always advisable to verify the current price on the official TTD website before making a booking. In addition to the ticket price, pilgrims may incur additional costs related to their travel, accommodation, and other expenses during their pilgrimage. While the SED ticket itself costs ₹300, it is important to remember that this is a relatively small portion of the overall expenditure associated with the trip. This fee covers the convenience of a pre-booked time slot, reduced waiting time, and a more organized darshan experience. The cost of the ticket is non-refundable under most circumstances, so pilgrims should carefully consider their travel plans before making a booking. Checking for the latest pricing information on the official TTD website ensures accurate budgeting for a smooth and fulfilling pilgrimage."
      },
      {
        "pageNumber": 4,
        "title": "How SED differs from other Darshan types",
        "content": "Special Entry Darshan (SED) differs significantly from other darshan types offered at Tirumala Tirupati Devasthanams (TTD), primarily in terms of accessibility, waiting time, and cost. The most common alternative is Sarva Darshan, which is free but involves significantly longer waiting times, often stretching to several hours. Unlike SED, Sarva Darshan does not require pre-booking and is open to all devotees. Another darshan type is Divya Darshan, reserved for pilgrims who trek up the Tirumala hills. This also does not involve a specific fee but requires physical exertion. Compared to these options, SED offers a balance between cost and convenience. It requires a payment of ₹300 but provides a pre-booked time slot and significantly reduced waiting time. VIP darshan, available for dignitaries and donors, is another category that offers even faster access but is not generally accessible to the public and is considerably more expensive. Therefore, SED stands out as an accessible and relatively affordable option for devotees seeking a more streamlined darshan experience without the extensive waiting periods associated with free darshan options. The organized booking system and reduced waiting times make it a popular choice for those seeking a balance between convenience and cost."
      }
    ]
  },
  {
    "chapter": "Booking Your Special Entry Darshan",
    "pages": [
      {
        "pageNumber": 5,
        "title": "Accessing the TTD Official Website",
        "content": "The first step in booking your Special Entry Darshan (SED) is to access the official website of Tirumala Tirupati Devasthanams (TTD). Ensure you are using the authentic TTD website to avoid fraudulent sites. The official website address is typically available through a simple search engine query for \"TTD official website.\" Look for the URL that clearly indicates it is the official domain of the TTD. Once you have located the correct website, you will find a user-friendly interface with various options related to darshan bookings, accommodation, and other pilgrim services. The website is regularly updated with the latest information, announcements, and guidelines for pilgrims. Familiarize yourself with the website layout and navigation to easily find the section dedicated to Special Entry Darshan bookings. The official TTD website is the only reliable source for booking SED tickets and obtaining accurate information about the darshan process. It is crucial to exercise caution and avoid third-party websites or agents that may claim to offer SED bookings, as these could be fraudulent or unreliable. Always verify the website's authenticity and security before providing any personal or financial information."
      },
      {
        "pageNumber": 6,
        "title": "Navigating the Booking Section",
        "content": "Once you are on the official TTD website, navigate to the section specifically designated for Special Entry Darshan (SED) bookings. This section is typically labelled as 'Online Services,' 'Darshan Booking,' or a similar heading related to online services for pilgrims. You may need to register or log in to your existing account to access the booking portal. If you are a new user, you will need to create an account by providing your personal details, such as name, date of birth, address, and contact information. After logging in, you will be directed to a page that displays available darshan slots and dates. The booking section will provide information about the number of available slots, the timings for each slot, and any specific instructions or guidelines related to the booking process. Carefully review the information provided before proceeding with your booking. The website may also offer options to view the darshan calendar, which shows the availability of slots across different dates. Use this calendar to plan your visit according to your preferred date and time."
      },
      {
        "pageNumber": 7,
        "title": "Filling the Booking Form (Personal Details, Dates)",
        "content": "After selecting your preferred date and time slot for the Special Entry Darshan (SED), you will be directed to the booking form. This form requires you to provide personal details for each pilgrim who will be attending the darshan. Ensure you accurately fill in the required information, including the full name, age, gender, and photo ID details (such as Aadhaar card, passport, or voter ID). The photo ID will be required for verification at the time of darshan, so it is crucial to provide the correct details. Double-check all the information you enter to avoid any discrepancies that may lead to complications later. The booking form will also ask for the number of pilgrims who will be accompanying you. Depending on the availability, you may be able to book tickets for multiple individuals at once. Carefully select the number of tickets you need and provide the necessary details for each pilgrim. Ensure that the chosen date and time slot are suitable for all members of your group. Some slots may have limited availability, so it's advisable to book well in advance to secure your preferred time."
      },
      {
        "pageNumber": 8,
        "title": "Making the Payment",
        "content": "Once you have filled in the booking form with all the required details, the next step is to make the payment for the Special Entry Darshan (SED) tickets. The official TTD website typically offers various payment options, including credit cards, debit cards, net banking, and UPI (Unified Payments Interface). Select your preferred payment method and follow the instructions to complete the transaction securely. Ensure that you have a stable internet connection during the payment process to avoid any interruptions that may lead to transaction failures. The website uses secure payment gateways to protect your financial information, so you can be assured of a safe and secure transaction. After successful payment, you will receive a confirmation message on the website and a notification to your registered email address or mobile number. Keep a record of the transaction ID or reference number for future reference. If the payment is unsuccessful for any reason, you may need to retry the process or contact the TTD helpline for assistance. Always ensure that you receive a payment confirmation before closing the browser window or navigating away from the payment page."
      },
      {
        "pageNumber": 9,
        "title": "Understanding Your Booking Confirmation (Ticket, QR Code)",
        "content": "After successfully completing the payment for your Special Entry Darshan (SED) tickets, you will receive a booking confirmation containing essential details about your darshan. This confirmation will typically include a downloadable e-ticket or a booking summary with a unique QR code. The QR code is a crucial element of your ticket, as it will be scanned at the entry point to verify your booking. Ensure you download the e-ticket or take a screenshot of the booking summary with the QR code clearly visible. The confirmation will also display the date and time of your darshan slot, the number of pilgrims included in the booking, and any specific instructions or guidelines related to the darshan. Carefully review all the details on the confirmation to ensure they are accurate. You will need to carry a printed copy of the e-ticket or have the digital version readily available on your mobile device when you arrive for darshan. Make sure your mobile device is fully charged and accessible on the day of your visit. The booking confirmation serves as proof of your pre-booked darshan slot and must be presented at the designated entry point."
      },
      {
        "pageNumber": 10,
        "title": "Troubleshooting Booking Issues",
        "content": "While the online booking process for Special Entry Darshan (SED) is generally smooth, you may occasionally encounter some technical issues or glitches. Common problems include payment failures, website errors, or difficulties in accessing the booking portal. If you experience a payment failure, check your bank statement to ensure that the amount has not been debited from your account. If the amount has been debited but you have not received a booking confirmation, contact the TTD helpline immediately with the transaction details. For website errors or difficulties in accessing the booking portal, try clearing your browser cache and cookies or using a different browser. Ensure that you have a stable internet connection and that your device meets the minimum system requirements for accessing the TTD website. If the problems persist, you can contact the TTD customer support team for assistance. The contact information for the TTD helpline is usually available on the official website. Be prepared to provide your booking details, transaction ID, and a clear description of the issue you are facing. The TTD support team will guide you through the necessary steps to resolve the problem and ensure that you can successfully complete your booking."
      }
    ]
  },
  {
    "chapter": "Pre-Darshan Preparations",
    "pages": [
      {
        "pageNumber": 11,
        "title": "Dress Code for Men and Women",
        "content": "Tirumala Tirupati Devasthanams (TTD) enforces a strict dress code for all pilgrims visiting the temple, including those with Special Entry Darshan (SED) tickets. This dress code is designed to maintain the sanctity and decorum of the sacred shrine. For men, traditional attire is mandatory. This typically includes a dhoti and uttareeyam (a shawl draped over the shoulders). Shirts are generally permitted, but it is preferable to wear traditional clothing. Jeans, shorts, t-shirts, and other casual wear are strictly prohibited. For women, the dress code requires them to wear a saree, salwar kameez with a dupatta, or a traditional skirt and blouse. Western attire such as jeans, leggings, and short tops are not allowed. The dress code is strictly enforced at the entry points, and pilgrims who are not appropriately dressed may be denied entry. It is advisable to adhere to the dress code guidelines to avoid any inconvenience or delays."
      },
      {
        "pageNumber": 12,
        "title": "Permitted and Prohibited Items",
        "content": "To ensure the security and sanctity of the temple, Tirumala Tirupati Devasthanams (TTD) has strict guidelines regarding permitted and prohibited items inside the temple complex. Pilgrims with Special Entry Darshan (SED) tickets should be aware of these regulations to avoid any inconvenience. Generally, personal belongings such as cameras, mobile phones, electronic devices, and large bags are not allowed inside the temple. There are cloakrooms available where you can deposit your belongings before entering the temple. Small purses or wallets are usually permitted, but it is advisable to carry only essential items. Items such as flowers, incense sticks, and camphor are often sold within the temple premises and can be used for offerings. However, check with the authorities for any specific restrictions on these items. Prohibited items include weapons, explosives, flammable materials, and any objects that could potentially disrupt the peace and tranquility of the temple. Food and beverages are also generally not allowed inside the temple, except for prasadam that is distributed by the TTD. It is important to cooperate with the security personnel and adhere to their instructions to ensure a smooth and respectful darshan experience."
      },
      {
        "pageNumber": 13,
        "title": "Required Documentation (Photo ID)",
        "content": "Pilgrims attending Special Entry Darshan (SED) at Tirumala Tirupati Devasthanams (TTD) are required to carry valid photo identification documents for verification purposes. This is essential for confirming the identity of the ticket holders and ensuring the security of the temple. The photo ID should match the details provided during the online booking process. Acceptable forms of photo identification include Aadhaar card, passport, voter ID, PAN card, or any other government-issued photo ID. Ensure that the photo ID is original and valid (not expired). A photocopy of the ID is generally not accepted. Each pilgrim included in the booking must carry their own individual photo ID. Children who do not have a photo ID may be required to provide alternative documentation, such as a birth certificate or school ID. The photo ID will be checked at various points during the darshan process, including at the entry point and at other security checkpoints. It is important to keep your photo ID readily accessible to avoid any delays. Failure to provide a valid photo ID may result in denial of entry, so it is crucial to remember to carry the necessary documentation."
      },
      {
        "pageNumber": 14,
        "title": "Health Advisories and Precautions",
        "content": "Given the large crowds and varying weather conditions at Tirumala, it is essential for pilgrims attending Special Entry Darshan (SED) to take certain health advisories and precautions. Individuals with pre-existing health conditions, such as heart problems, respiratory issues, or high blood pressure, should consult their doctor before undertaking the pilgrimage. It is also advisable to carry any necessary medications with you. Due to the altitude of Tirumala, some pilgrims may experience altitude sickness. It is important to stay hydrated by drinking plenty of water and avoiding strenuous activities. If you experience symptoms such as headache, nausea, or dizziness, seek medical assistance immediately. During peak seasons, the temple complex can be very crowded, so it is important to be cautious and avoid pushing or shoving. Wear comfortable shoes to avoid foot injuries. Maintain personal hygiene by washing your hands frequently. It's important to be aware of the local weather conditions and dress accordingly. Protect yourself from the sun by wearing sunscreen and a hat. Follow all health advisories issued by the TTD authorities and cooperate with the medical staff if needed to ensure a safe and healthy pilgrimage."
      }
    ]
  },
  {
    "chapter": "Day of Darshan: Your Itinerary",
    "pages": [
      {
        "pageNumber": 15,
        "title": "Reporting Time and Location (ATC Circle)",
        "content": "For pilgrims with Special Entry Darshan (SED) tickets, reporting at the correct time and location is crucial for a smooth darshan experience. The reporting location for SED pilgrims is typically at the ATC Circle in Tirumala. The ATC Circle is a well-known landmark in Tirumala and is easily accessible by taxi, bus, or on foot from most accommodations. The exact reporting time will be specified on your SED ticket. It is essential to arrive at the ATC Circle at least 30 minutes before your scheduled time slot to allow for security checks and verification processes. The TTD authorities will have designated counters or queues for SED pilgrims at the ATC Circle. Look for signs or ask for assistance from the TTD staff to find the correct queue. Ensure that you have your e-ticket or booking confirmation readily available, along with your valid photo ID. At the reporting location, your ticket will be verified, and you will be guided through the next steps of the darshan process. Adhering to the reporting time and location will ensure that you can proceed smoothly with your darshan and avoid any unnecessary delays or complications."
      },
      {
        "pageNumber": 16,
        "title": "Procedure for Entry and Darshan",
        "content": "After reporting at the ATC Circle, pilgrims with Special Entry Darshan (SED) tickets will be guided through the entry and darshan procedure. Following verification of your ticket and photo ID, you will be directed to a designated queue line for SED pilgrims. This queue line is typically shorter and moves faster than the lines for other darshan types. As you proceed through the queue, you will pass through security checkpoints where you may be subject to security checks. Cooperate with the security personnel and follow their instructions. Electronic devices, cameras, and other prohibited items should not be carried inside the temple. After passing through the security checks, you will enter the main temple complex and proceed towards the sanctum sanctorum, where the deity of Lord Venkateswara is located. Maintain silence and reverence as you approach the sanctum. The darshan time is typically limited to a few seconds to allow all pilgrims to have an opportunity to view the deity. After the darshan, you will be guided through the exit route. Follow the instructions of the TTD staff and maintain a respectful demeanor throughout the entire process."
      },
      {
        "pageNumber": 17,
        "title": "Collecting Prasadam",
        "content": "After completing the darshan of Lord Venkateswara, pilgrims with Special Entry Darshan (SED) tickets are usually entitled to collect prasadam. The prasadam distribution counter is typically located near the exit of the temple complex. Follow the signs or ask the TTD staff for directions to the prasadam counter. Present your SED ticket or booking confirmation to the staff at the counter. You will receive a pre-packaged prasadam, which may include items such as laddu, vada, or other sweets. The prasadam is considered sacred and is typically consumed by the pilgrims and shared with family and friends as a blessing from Lord Venkateswara. Ensure you handle the prasadam with respect and avoid littering. If you have any allergies or dietary restrictions, inquire about the ingredients of the prasadam before consuming it. The prasadam distribution is an integral part of the pilgrimage experience and a way to receive the divine blessings of the Lord."
      },
      {
        "pageNumber": 18,
        "title": "Post-Darshan Information",
        "content": "After collecting prasadam, you can proceed to exit the temple complex. It is important to note a few key details post-darshan. Ensure you have all your belongings with you before leaving the premises. If you deposited any items in the cloakroom, retrieve them using your cloakroom token. Be mindful of other pilgrims and avoid causing any congestion or disruption. If you require any assistance or have any queries, approach the TTD information centers located within the complex. These centers can provide information about transportation, accommodation, and other pilgrim services. Take some time to reflect on your darshan experience and offer gratitude to Lord Venkateswara. Share your experience with family and friends and encourage them to visit Tirumala as well. After leaving the temple complex, you can explore other attractions in Tirumala, such as the Sri Venkateswara Museum, the Akash Ganga waterfalls, or the Sila Thoranam natural rock formation. Plan your travel arrangements for your departure from Tirumala. Ensure you have confirmed transportation bookings and allow ample time to reach your destination."
      }
    ]
  },
  {
    "chapter": "Important Policies and FAQs",
    "pages": [
      {
        "pageNumber": 19,
        "title": "Booking Cancellation Policy",
        "content": "The Tirumala Tirupati Devasthanams (TTD) has a specific cancellation policy for Special Entry Darshan (SED) bookings. Generally, cancellation of SED tickets is not permitted. Once a booking is confirmed and payment is made, the ticket is considered non-refundable and non-transferable. In exceptional circumstances, such as unforeseen medical emergencies or unavoidable personal situations, pilgrims may attempt to request a cancellation or reschedule through the TTD helpline. However, approval of such requests is at the sole discretion of the TTD authorities and is subject to verification of supporting documentation. If a cancellation or reschedule is approved, there may be cancellation charges or other fees applicable. It is important to carefully review the terms and conditions of the SED booking before making a payment, as the cancellation policy is strictly enforced. Pilgrims are advised to plan their visit carefully and ensure that they are able to attend the darshan on the scheduled date and time before booking the tickets. The TTD reserves the right to modify the cancellation policy at any time, so it is recommended to check the official website for the latest updates."
      },
      {
        "pageNumber": 20,
        "title": "Refund Policy",
        "content": "As a general rule, the Tirumala Tirupati Devasthanams (TTD) has a no-refund policy for Special Entry Darshan (SED) tickets. Once a booking is confirmed and payment is made, the amount is non-refundable, even if the pilgrim is unable to attend the darshan. However, in exceptional cases where the darshan is cancelled by the TTD due to unforeseen circumstances, such as natural disasters, technical issues, or other unavoidable reasons, a refund may be considered. In such cases, the TTD will typically announce the refund policy and the procedure for claiming the refund. Pilgrims will need to provide their booking details and other relevant information to process the refund. The refund amount, if approved, will be credited to the original payment method used for the booking. The refund process may take several weeks or months to complete, depending on the circumstances. It is important to note that the TTD's decision on refund matters is final and binding. Pilgrims are advised to stay informed about the TTD's policies and announcements through the official website or other official communication channels."
      },
      {
        "pageNumber": 21,
        "title": "TTD's Right to Cancel Darshan",
        "content": "The Tirumala Tirupati Devasthanams (TTD) reserves the right to cancel or reschedule darshan, including Special Entry Darshan (SED), due to unforeseen circumstances or reasons beyond its control. These circumstances may include natural disasters, technical issues, security concerns, or other events that disrupt the normal functioning of the temple. In the event of a darshan cancellation by the TTD, pilgrims will be notified through the official website, media announcements, or other communication channels. The TTD may offer alternative darshan dates or a refund of the ticket price, depending on the circumstances. The decision to cancel or reschedule darshan rests solely with the TTD authorities, and their decision is final and binding. Pilgrims are advised to stay updated on the latest announcements and advisories issued by the TTD, especially during peak seasons or times of uncertainty. While the TTD strives to ensure a smooth and uninterrupted darshan experience for all pilgrims, unforeseen events may necessitate changes or cancellations. The safety and security of the pilgrims and the sanctity of the temple are the top priorities of the TTD."
      },
      {
        "pageNumber": 22,
        "title": "Contact Information for TTD",
        "content": "For any queries, assistance, or complaints related to Special Entry Darshan (SED) or other pilgrim services, you can contact the Tirumala Tirupati Devasthanams (TTD) through various channels. The TTD has a dedicated helpline number that you can call for immediate assistance. The helpline number is typically available on the official TTD website. You can also send an email to the TTD customer support team with your questions or concerns. The email address is also usually provided on the website. In addition to the helpline and email, you can also visit the TTD information centers located in Tirumala and Tirupati. These centers provide information and assistance to pilgrims on various aspects of the pilgrimage. The TTD also has a social media presence on platforms such as Facebook and Twitter, where they share updates and announcements. You can also reach out to them through these social media channels. When contacting the TTD, be prepared to provide your booking details, transaction ID, and a clear description of your query or concern. The TTD staff will do their best to assist you and resolve your issues in a timely manner."
      },
      {
        "pageNumber": 23,
        "title": "Frequently Asked Questions",
        "content": "Here are some frequently asked questions (FAQs) related to Special Entry Darshan (SED) at Tirumala Tirupati Devasthanams (TTD):\n\n**Q: How can I book SED tickets?**\nA: SED tickets can be booked online through the official TTD website. You need to register or log in to your account, select your preferred date and time slot, fill in the required details, and make the payment.\n\n**Q: What is the cost of an SED ticket?**\nA: The cost of an SED ticket is ₹300 per person.\n\n**Q: Is there a dress code for SED?**\nA: Yes, there is a strict dress code. Men should wear dhoti and uttareeyam, while women should wear saree or salwar kameez with a dupatta.\n\n**Q: Can I cancel my SED ticket?**\nA: Generally, cancellation is not permitted. However, in exceptional cases, you may contact the TTD helpline for assistance.\n\n**Q: What documents are required for SED?**\nA: You need to carry a valid photo ID, such as Aadhaar card, passport, or voter ID.\n\n**Q: Where do I report for SED?**\nA: You need to report at the ATC Circle in Tirumala at least 30 minutes before your scheduled time slot.\n\n**Q: Can I carry my mobile phone inside the temple?**\nA: No, mobile phones and other electronic devices are not allowed inside the temple.\n\nThese FAQs provide a quick reference for common queries related to SED. For more detailed information, refer to the official TTD website or contact the TTD helpline."
      }
    ]
  }
]
\`\`\``;

// Helper function to extract JSON content from a markdown code block.
function extractJSONFromCodeBlock(text) {
  const regex = /```json\s*([\s\S]*?)\s*```/;
  const match = text.match(regex);
  return match ? match[1] : text;
}

export default function DescriptiveQAViewer() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  // Parse the raw JSON on component mount.
  useEffect(() => {
    try {
      const jsonString = extractJSONFromCodeBlock(rawText);
      const parsedData = JSON.parse(jsonString);
      setData(parsedData);
    } catch (err) {
      console.error("Error parsing JSON:", err);
      setError(err.message);
    }
  }, []);

  if (error) {
    return <div>Error parsing JSON: {error}</div>;
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Course Content</h1>
      {data.map((chapter, chapterIdx) => (
        <div
          key={chapterIdx}
          style={{
            border: "1px solid #ccc",
            borderRadius: "5px",
            marginBottom: "20px",
            padding: "15px",
            backgroundColor: "#fefefe"
          }}
        >
          <h2>{chapter.chapter}</h2>
          {chapter.pages.map((page, pageIdx) => (
            <div
              key={pageIdx}
              style={{
                marginBottom: "15px",
                padding: "10px",
                background: "#f9f9f9",
                borderRadius: "3px"
              }}
            >
              <h3>
                Page {page.pageNumber}: {page.title}
              </h3>
              <p>{page.content}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
  