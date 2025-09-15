import ExpoModulesCore
import CoreTelephony
import NetworkExtension
import Network

public class AlwaysONModule: Module {
  private let networkMonitor = NWPathMonitor()
  private let networkInfo = CTTelephonyNetworkInfo()
  
  public func definition() -> ModuleDefinition {
    Name("AlwaysON")
    
    // Check if device supports eSIM
    AsyncFunction("isESIMSupported") { () -> Bool in
      return CTCellularPlanProvisioning.supportsEmbeddedSIM
    }
    
    // Get current SIM card information
    AsyncFunction("getCurrentSIMInfo") { () -> [String: Any]? in
      guard let carrier = self.networkInfo.serviceSubscriberCellularProviders?.first?.value else {
        return nil
      }
      
      return [
        "carrier": carrier.carrierName ?? "Unknown",
        "mobileCountryCode": carrier.mobileCountryCode ?? "",
        "mobileNetworkCode": carrier.mobileNetworkCode ?? "",
        "isoCountryCode": carrier.isoCountryCode ?? ""
      ]
    }
    
    // Install eSIM profile
    AsyncFunction("installESIMProfile") { (profileURL: String, promise: Promise) in
      guard let url = URL(string: profileURL) else {
        promise.reject("INVALID_URL", "Invalid eSIM profile URL")
        return
      }
      
      let request = CTCellularPlanProvisioningRequest()
      request.address = profileURL
      
      CTCellularPlanProvisioning().addPlan(with: request) { result in
        switch result {
        case .success:
          promise.resolve(["success": true, "message": "eSIM profile installed successfully"])
        case .failure(let error):
          promise.reject("ESIM_INSTALL_ERROR", "Failed to install eSIM: \(error.localizedDescription)")
        }
      }
    }
    
    // Remove eSIM profile (this requires user interaction)
    AsyncFunction("removeESIMProfile") { (promise: Promise) in
      // Note: iOS doesn't allow apps to directly remove eSIM profiles
      // This would typically open Settings app to let user manually remove
      let settingsURL = URL(string: "App-Prefs:root=MOBILE_DATA_SETTINGS_ID")!
      
      DispatchQueue.main.async {
        if UIApplication.shared.canOpenURL(settingsURL) {
          UIApplication.shared.open(settingsURL) { success in
            promise.resolve([
              "success": success,
              "message": success ? "Opened cellular settings" : "Could not open settings"
            ])
          }
        } else {
          promise.reject("SETTINGS_ERROR", "Cannot open cellular settings")
        }
      }
    }
    
    // Get network connection status
    AsyncFunction("getNetworkStatus") { (promise: Promise) in
      let path = self.networkMonitor.currentPath
      
      var connectionType = "none"
      var isExpensive = false
      
      if path.status == .satisfied {
        if path.usesInterfaceType(.wifi) {
          connectionType = "wifi"
        } else if path.usesInterfaceType(.cellular) {
          connectionType = "cellular"
          isExpensive = path.isExpensive
        } else {
          connectionType = "other"
        }
      }
      
      promise.resolve([
        "isConnected": path.status == .satisfied,
        "connectionType": connectionType,
        "isExpensive": isExpensive,
        "isConstrained": path.isConstrained
      ])
    }
    
    // Start network monitoring
    AsyncFunction("startNetworkMonitoring") { () in
      let queue = DispatchQueue(label: "NetworkMonitor")
      self.networkMonitor.start(queue: queue)
    }
    
    // Stop network monitoring
    AsyncFunction("stopNetworkMonitoring") { () in
      self.networkMonitor.cancel()
    }
    
    // Events for network status changes
    Events("onNetworkStatusChange")
    
    OnCreate {
      // Set up network monitoring callback
      self.networkMonitor.pathUpdateHandler = { path in
        var connectionType = "none"
        
        if path.status == .satisfied {
          if path.usesInterfaceType(.wifi) {
            connectionType = "wifi"
          } else if path.usesInterfaceType(.cellular) {
            connectionType = "cellular"
          } else {
            connectionType = "other"
          }
        }
        
        self.sendEvent("onNetworkStatusChange", [
          "isConnected": path.status == .satisfied,
          "connectionType": connectionType,
          "isExpensive": path.isExpensive,
          "isConstrained": path.isConstrained,
          "timestamp": Date().timeIntervalSince1970
        ])
      }
    }
  }
}