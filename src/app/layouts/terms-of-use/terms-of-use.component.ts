import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent } from '@goat-bravos/intern-hub-layout';

@Component({
  selector: 'app-terms-of-use',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  templateUrl: './terms-of-use.component.html',
  styleUrls: ['./terms-of-use.component.scss'],
})
export class TermsOfUseComponent {
  lastUpdated = '04/03/2026';

  sections = [
    {
      title: '1. Giới thiệu',
      content: `Chào mừng bạn đến với FPT Intern Hub ("Nền tảng"). Nền tảng được vận hành bởi FPT Information System nhằm hỗ trợ quản lý và nâng cao trải nghiệm thực tập cho sinh viên. Bằng việc truy cập và sử dụng Nền tảng, bạn đồng ý tuân thủ các Điều khoản sử dụng này. Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng ngừng sử dụng Nền tảng.`,
    },
    {
      title: '2. Định nghĩa',
      content: '',
      definitions: [
        {
          term: '"Nền tảng"',
          meaning:
            'FPT Intern Hub, bao gồm tất cả các tính năng, dịch vụ và nội dung được cung cấp.',
        },
        {
          term: '"Người dùng"',
          meaning:
            'Bất kỳ cá nhân nào truy cập hoặc sử dụng Nền tảng, bao gồm thực tập sinh, nhân viên quản lý và quản trị viên.',
        },
        {
          term: '"Tài khoản"',
          meaning: 'Tài khoản cá nhân được tạo để truy cập và sử dụng các tính năng của Nền tảng.',
        },
        {
          term: '"Nội dung"',
          meaning:
            'Bao gồm văn bản, hình ảnh, dữ liệu, tài liệu đào tạo và mọi thông tin khác được đăng tải trên Nền tảng.',
        },
      ],
    },
    {
      title: '3. Tài khoản người dùng',
      content: '',
      subSections: [
        {
          title: '3.1. Đăng ký tài khoản',
          items: [
            'Tài khoản được cấp bởi quản trị viên hệ thống hoặc đăng ký thông qua quy trình xác thực của Nền tảng',
            'Bạn phải cung cấp thông tin chính xác, đầy đủ và cập nhật',
            'Mỗi người dùng chỉ được sử dụng một tài khoản duy nhất',
          ],
        },
        {
          title: '3.2. Bảo mật tài khoản',
          items: [
            'Bạn có trách nhiệm bảo mật thông tin đăng nhập của mình',
            'Không chia sẻ mật khẩu hoặc cho phép người khác sử dụng tài khoản của bạn',
            'Thông báo ngay cho quản trị viên nếu phát hiện truy cập trái phép',
            'Chúng tôi không chịu trách nhiệm cho các hoạt động xảy ra dưới tài khoản của bạn do sự bất cẩn trong bảo mật',
          ],
        },
      ],
    },
    {
      title: '4. Quyền và nghĩa vụ của Người dùng',
      content: '',
      subSections: [
        {
          title: '4.1. Quyền của Người dùng',
          items: [
            'Truy cập và sử dụng các tính năng của Nền tảng phù hợp với vai trò được phân quyền',
            'Xem và quản lý thông tin cá nhân trên hồ sơ',
            'Tham gia các chương trình đào tạo và theo dõi lộ trình học tập',
            'Gửi phản hồi và góp ý thông qua hòm thư góp ý',
            'Nhận thông báo về các hoạt động liên quan',
          ],
        },
        {
          title: '4.2. Nghĩa vụ của Người dùng',
          items: [
            'Tuân thủ tất cả các quy định, nội quy của FPT và Điều khoản sử dụng này',
            'Sử dụng Nền tảng đúng mục đích, không vi phạm pháp luật',
            'Không thực hiện các hành vi gây hại cho Nền tảng hoặc người dùng khác',
            'Cập nhật thông tin cá nhân khi có thay đổi',
            'Báo cáo các lỗi, sự cố hoặc vi phạm phát hiện được',
          ],
        },
      ],
    },
    {
      title: '5. Hành vi bị cấm',
      content: 'Khi sử dụng Nền tảng, bạn không được thực hiện các hành vi sau:',
      items: [
        'Sử dụng Nền tảng cho mục đích bất hợp pháp hoặc trái với quy định',
        'Truy cập trái phép vào hệ thống, dữ liệu hoặc tài khoản của người khác',
        'Tải lên, phát tán mã độc, virus hoặc phần mềm gây hại',
        'Sao chép, phân phối hoặc sửa đổi nội dung mà không được phép',
        'Sử dụng công cụ tự động để thu thập dữ liệu (scraping, crawling)',
        'Đăng tải nội dung vi phạm bản quyền, xúc phạm hoặc không phù hợp',
        'Can thiệp vào hoạt động bình thường của Nền tảng',
        'Giả mạo danh tính hoặc thông tin cá nhân',
      ],
    },
    {
      title: '6. Sở hữu trí tuệ',
      content: '',
      subSections: [
        {
          title: '6.1. Quyền sở hữu',
          items: [
            'Toàn bộ nội dung, thiết kế, mã nguồn, logo và thương hiệu trên Nền tảng thuộc sở hữu của FPT Information System',
            'Tài liệu đào tạo và nội dung học tập được bảo vệ bởi luật sở hữu trí tuệ',
          ],
        },
        {
          title: '6.2. Giấy phép sử dụng',
          items: [
            'Bạn được cấp quyền sử dụng Nền tảng cho mục đích cá nhân, không thương mại trong phạm vi chương trình thực tập',
            'Quyền sử dụng này không bao gồm quyền sao chép, phân phối hoặc tạo sản phẩm phái sinh',
          ],
        },
      ],
    },
    {
      title: '7. Giới hạn trách nhiệm',
      content: 'FPT Intern Hub không chịu trách nhiệm trong các trường hợp:',
      items: [
        'Gián đoạn dịch vụ do bảo trì, nâng cấp hệ thống hoặc sự cố kỹ thuật ngoài tầm kiểm soát',
        'Mất mát dữ liệu do lỗi của Người dùng hoặc bên thứ ba',
        'Thiệt hại gián tiếp phát sinh từ việc sử dụng hoặc không thể sử dụng Nền tảng',
        'Nội dung do Người dùng đăng tải trên Nền tảng',
      ],
    },
    {
      title: '8. Chấm dứt tài khoản',
      content: 'Chúng tôi có quyền tạm khóa hoặc chấm dứt tài khoản của bạn trong các trường hợp:',
      items: [
        'Vi phạm Điều khoản sử dụng này',
        'Kết thúc chương trình thực tập',
        'Theo yêu cầu của cơ quan có thẩm quyền',
        'Không hoạt động trong thời gian dài mà không có lý do chính đáng',
      ],
    },
    {
      title: '9. Thay đổi Điều khoản',
      content: `Chúng tôi có quyền sửa đổi, cập nhật Điều khoản sử dụng này vào bất kỳ lúc nào. Mọi thay đổi sẽ được thông báo trên Nền tảng hoặc qua email. Việc bạn tiếp tục sử dụng Nền tảng sau khi có thay đổi đồng nghĩa với việc bạn chấp nhận các điều khoản mới.`,
    },
    {
      title: '10. Luật áp dụng',
      content: `Điều khoản sử dụng này được điều chỉnh và giải thích theo pháp luật Việt Nam. Mọi tranh chấp phát sinh sẽ được giải quyết thông qua thương lượng, hòa giải hoặc tại tòa án có thẩm quyền tại Việt Nam.`,
    },
    {
      title: '11. Liên hệ',
      content:
        'Nếu bạn có bất kỳ câu hỏi hoặc thắc mắc nào về Điều khoản sử dụng này, vui lòng liên hệ:',
      contactInfo: {
        name: 'Công ty TNHH BBTech',
        email: 'tech@bbtech.io.vn',
        address: '130/9 Nghĩa Phát, Phường 7, Quận Tân Bình, Tp. HCM',
      },
    },
  ];
}
