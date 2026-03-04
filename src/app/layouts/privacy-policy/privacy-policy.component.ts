import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent } from "@goat-bravos/intern-hub-layout";

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
})
export class PrivacyPolicyComponent {
  lastUpdated = '04/03/2026';

  permissions = [
    {
      icon: 'dsi-camera-line',
      name: 'CAMERA',
      description: 'Chụp ảnh, đăng ký khuôn mặt',
      purpose: 'Sử dụng cho tính năng đăng ký và xác thực khuôn mặt, chụp ảnh đại diện hồ sơ cá nhân.',
    },
    {
      icon: 'dsi-map-pin-line',
      name: 'Vị trí (Location)',
      description: 'Check-in / Check-out',
      purpose: 'Xác định vị trí của bạn khi thực hiện check-in và check-out tại nơi thực tập, đảm bảo tính chính xác của chấm công.',
    },
    {
      icon: 'dsi-image-line',
      name: 'Ảnh / File (Storage)',
      description: 'Chọn ảnh từ thư viện',
      purpose: 'Cho phép bạn chọn ảnh từ thư viện thiết bị để cập nhật ảnh đại diện hoặc đính kèm tài liệu liên quan.',
    },
    {
      icon: 'dsi-bell-line',
      name: 'Thông báo (Push Notifications)',
      description: 'Gửi thông báo đẩy',
      purpose: 'Gửi thông báo về lịch trình, sự kiện, cập nhật quan trọng liên quan đến chương trình thực tập của bạn.',
    },
  ];

  sections = [
    {
      title: '1. Giới thiệu',
      content: `Chào mừng bạn đến với FPT Intern Hub. Chúng tôi cam kết bảo vệ quyền riêng tư và thông tin cá nhân của bạn. Chính sách Bảo mật này giải thích cách chúng tôi thu thập, sử dụng, chia sẻ và bảo vệ thông tin cá nhân của bạn khi bạn sử dụng nền tảng FPT Intern Hub ("Nền tảng").`,
    },
    {
      title: '2. Tại sao cần Chính sách Bảo mật?',
      content: `Google Play Console yêu cầu tất cả ứng dụng sử dụng các quyền nhạy cảm phải cung cấp đường dẫn (URL) tới trang Chính sách quyền riêng tư. FPT Intern Hub sử dụng các quyền sau đây để phục vụ hoạt động thực tập, do đó việc công khai Chính sách Bảo mật là bắt buộc:`,
      items: [
        'CAMERA — Chụp ảnh, đăng ký khuôn mặt',
        'Vị trí (Location) — Check-in / Check-out',
        'Ảnh / File (Storage) — Chọn ảnh từ thư viện',
        'Thông báo (Push Notifications) — Gửi thông báo đẩy',
      ],
    },
    {
      title: '3. Quyền truy cập ứng dụng',
      content: `Để cung cấp đầy đủ các tính năng, FPT Intern Hub yêu cầu các quyền truy cập sau trên thiết bị của bạn. Mỗi quyền chỉ được sử dụng cho mục đích cụ thể và bạn có thể thu hồi quyền bất kỳ lúc nào trong cài đặt thiết bị:`,
      isPermissionSection: true,
    },
    {
      title: '4. Thông tin chúng tôi thu thập',
      content: '',
      subSections: [
        {
          title: '4.1. Thông tin bạn cung cấp trực tiếp',
          items: [
            'Họ và tên, ngày sinh, giới tính',
            'Địa chỉ email, số điện thoại',
            'Thông tin tài khoản (tên đăng nhập, mật khẩu được mã hóa)',
            'Thông tin hồ sơ cá nhân (ảnh đại diện, vị trí, phòng ban)',
            'Thông tin về quá trình thực tập (dự án, đánh giá, lộ trình đào tạo)',
          ],
        },
        {
          title: '4.2. Thông tin thu thập tự động',
          items: [
            'Địa chỉ IP, loại trình duyệt, hệ điều hành',
            'Thông tin thiết bị (device token)',
            'Dữ liệu sử dụng nền tảng (trang đã truy cập, thời gian sử dụng)',
            'Cookie và các công nghệ theo dõi tương tự',
          ],
        },
      ],
    },
    {
      title: '5. Mục đích sử dụng thông tin',
      content: 'Chúng tôi sử dụng thông tin cá nhân của bạn cho các mục đích sau:',
      items: [
        'Quản lý tài khoản và xác thực người dùng',
        'Cung cấp và cải thiện các dịch vụ trên Nền tảng',
        'Gửi thông báo liên quan đến hoạt động thực tập',
        'Quản lý lộ trình đào tạo và đánh giá hiệu suất',
        'Hỗ trợ kỹ thuật và phản hồi góp ý',
        'Tuân thủ các yêu cầu pháp lý',
      ],
    },
    {
      title: '6. Chia sẻ thông tin',
      content: 'Chúng tôi không bán hoặc cho thuê thông tin cá nhân của bạn cho bên thứ ba. Thông tin của bạn chỉ được chia sẻ trong các trường hợp sau:',
      items: [
        'Với các đơn vị nội bộ của FPT liên quan đến quản lý thực tập',
        'Với các đối tác cung cấp dịch vụ kỹ thuật (lưu trữ đám mây, phân tích dữ liệu) theo hợp đồng bảo mật',
        'Khi có yêu cầu từ cơ quan nhà nước có thẩm quyền theo quy định pháp luật',
      ],
    },
    {
      title: '7. Bảo mật thông tin',
      content: 'Chúng tôi áp dụng các biện pháp bảo mật phù hợp để bảo vệ thông tin cá nhân của bạn:',
      items: [
        'Mã hóa dữ liệu truyền tải (SSL/TLS)',
        'Mã hóa mật khẩu và token xác thực',
        'Kiểm soát truy cập dựa trên vai trò (RBAC)',
        'Giám sát và ghi nhật ký hoạt động hệ thống',
        'Sao lưu dữ liệu định kỳ',
      ],
    },
    {
      title: '8. Quyền của bạn',
      content: 'Bạn có các quyền sau đối với thông tin cá nhân:',
      items: [
        'Quyền truy cập: Xem thông tin cá nhân mà chúng tôi lưu trữ',
        'Quyền chỉnh sửa: Cập nhật hoặc sửa đổi thông tin cá nhân',
        'Quyền xóa: Yêu cầu xóa thông tin cá nhân (tuân theo quy định pháp luật)',
        'Quyền phản đối: Phản đối việc xử lý thông tin cá nhân trong một số trường hợp',
        'Quyền rút lại đồng ý: Rút lại sự đồng ý đã cho trước đó',
      ],
    },
    {
      title: '9. Cookie',
      content: `Nền tảng sử dụng cookie và các công nghệ tương tự để cải thiện trải nghiệm người dùng. Bạn có thể quản lý cài đặt cookie thông qua trình duyệt của mình. Tuy nhiên, việc tắt cookie có thể ảnh hưởng đến một số tính năng của Nền tảng.`,
    },
    {
      title: '10. Thay đổi Chính sách',
      content: `Chúng tôi có thể cập nhật Chính sách Bảo mật này theo thời gian. Mọi thay đổi sẽ được thông báo trên Nền tảng. Việc tiếp tục sử dụng Nền tảng sau khi có thay đổi đồng nghĩa với việc bạn chấp nhận các điều khoản mới.`,
    },
    {
      title: '11. Liên hệ',
      content: `Nếu bạn có bất kỳ câu hỏi hoặc yêu cầu nào liên quan đến Chính sách Bảo mật này, vui lòng liên hệ:`,
      contactInfo: {
        name: 'Công ty TNHH BBTech',
        email: 'tech@bbtech.io.vn',
        address: '130/9 Nghĩa Phát, Phường 7, Quận Tân Bình, Tp. HCM',
      },
    },
  ];
}
